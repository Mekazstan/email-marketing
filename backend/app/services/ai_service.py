import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from typing import Dict, List
from app.models.prospect import Prospect
from app.models.engagement import Engagement

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize ChatGroq
llm = ChatGroq(
    model="llama3-8b-8192",
    temperature=0.5,
    max_tokens=None,
    timeout=None,
    max_retries=2
)


class AIService:
    def __init__(self):
        self.llm = llm
    
    def _get_industry_specifics(self, industry: str) -> Dict:
        """
        Get industry-specific keywords, pain points, and selling points
        for personalization based on the industry.
        """
        industry_map = {
            "technology": {
                "keywords": ["innovation", "digital transformation", "security", "scalability"],
                "pain_points": ["data breaches", "tech obsolescence", "rapid growth risks"],
                "selling_points": [
                    "Tech-specific liability coverage",
                    "Cyber insurance tailored for tech companies",
                    "Coverage that scales with your company"
                ]
            },
            "finance": {
                "keywords": ["security", "compliance", "ROI", "risk management"],
                "pain_points": ["regulatory compliance", "financial liability", "client trust"],
                "selling_points": [
                    "Comprehensive financial liability protection",
                    "Specialized coverage for financial institutions",
                    "Client trust protection insurance"
                ]
            },
            "healthcare": {
                "keywords": ["compliance", "patient care", "efficiency", "risk mitigation"],
                "pain_points": ["medical malpractice", "HIPAA compliance", "healthcare costs"],
                "selling_points": [
                    "HIPAA-compliant insurance solutions",
                    "Medical malpractice coverage",
                    "Healthcare-specific liability insurance"
                ]
            },
            "retail": {
                "keywords": ["customer experience", "inventory", "liability", "business continuity"],
                "pain_points": ["property damage", "business interruption", "product liability"],
                "selling_points": [
                    "Retail-specific property insurance",
                    "Business interruption coverage",
                    "Product liability protection"
                ]
            },
            "manufacturing": {
                "keywords": ["efficiency", "safety", "supply chain", "equipment"],
                "pain_points": ["workplace injuries", "equipment failure", "supply chain disruptions"],
                "selling_points": [
                    "Worker's compensation tailored for manufacturing",
                    "Equipment breakdown coverage",
                    "Supply chain interruption insurance"
                ]
            }
        }
        
        # Normalize the industry name for matching
        industry_lower = industry.lower()
        
        # Try to find an exact match
        if industry_lower in industry_map:
            return industry_map[industry_lower]
        
        # If no exact match, try to find a partial match
        for key in industry_map:
            if key in industry_lower or industry_lower in key:
                return industry_map[key]
        
        # Default to generic if no match found
        return {
            "keywords": ["protection", "coverage", "risk management"],
            "pain_points": ["liability risks", "unexpected costs", "business interruptions"],
            "selling_points": [
                "Comprehensive business insurance",
                "Customized insurance solutions",
                "Risk management expertise"
            ]
        }
    
    def _get_engagement_approach(self, engagement_history: List[Engagement]) -> Dict:
        """
        Determine the appropriate approach based on previous engagement history.
        """
        if not engagement_history:
            return {
                "approach": "initial",
                "tone": "informative and friendly",
                "focus": "introduction and value proposition",
                "call_to_action": "schedule a brief call"
            }
        
        # Check if they've opened/clicked emails
        opened_count = sum(1 for e in engagement_history if e.opened)
        clicked_count = sum(1 for e in engagement_history if e.clicked)
        responded_count = sum(1 for e in engagement_history if e.responded)
        
        if responded_count > 0:
            return {
                "approach": "warm follow-up",
                "tone": "appreciative and consultative",
                "focus": "deepening the relationship",
                "call_to_action": "schedule a detailed consultation"
            }
        elif clicked_count > 0:
            return {
                "approach": "interested follow-up",
                "tone": "helpful and proactive",
                "focus": "addressing specific interests",
                "call_to_action": "schedule a quick call to discuss specific solutions"
            }
        elif opened_count > 0:
            return {
                "approach": "awareness follow-up",
                "tone": "informative with new value points",
                "focus": "building interest with more specific benefits",
                "call_to_action": "check out more resources or schedule a call"
            }
        else:
            return {
                "approach": "re-engagement",
                "tone": "direct and attention-grabbing",
                "focus": "new angle or value proposition",
                "call_to_action": "simple response or quick call"
            }

    async def generate_personalized_email(self, prospect: Prospect, engagement_history: List[Engagement]) -> Dict:
        """
        Generate a personalized email for a prospect based on their industry and engagement history.
        """
        # Get industry-specific information
        industry_specifics = self._get_industry_specifics(prospect.industry)
        
        # Get engagement-based approach
        engagement_approach = self._get_engagement_approach(engagement_history)
        
        # Define potential objections based on industry
        potential_objections = {
            "technology": ["We already have cyber insurance", "Our tech stack is secure", "Insurance is too expensive"],
            "finance": ["We're already heavily insured", "We handle risk internally", "Regulatory compliance is sufficient"],
            "healthcare": ["Our existing malpractice coverage is enough", "We're too small to need comprehensive coverage", "HIPAA compliance is our priority"],
            "retail": ["Our business is too small", "We don't have valuable physical assets", "Online retail has different needs"],
            "manufacturing": ["We have long-standing insurance partners", "Our safety record is excellent", "Our equipment is well-maintained"]
        }
        
        # Get objections for this industry or use generic ones
        industry_lower = prospect.industry.lower()
        objections = next((v for k, v in potential_objections.items() if k in industry_lower), 
                         ["We already have insurance", "It's too expensive", "We don't see the value"])
        
        # Define the prompt template
        email_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are an expert in writing personalized insurance sales outreach emails."),
                ("human", """
                Generate a personalized cold email for an insurance company reaching out to {company_name} in the {industry} industry.
                
                Company details:
                - Name: {company_name}
                - Industry: {industry}
                - Contact Person: {contact_person}
                
                Approach: {approach}
                Tone: {tone}
                Focus: {focus}
                
                Industry-specific information:
                - Keywords to emphasize: {keywords}
                - Industry pain points to address: {pain_points}
                - Selling points to highlight: {selling_points}
                
                Address these potential objections subtly:
                - {objection1}
                - {objection2}
                - {objection3}
                
                Email structure:
                1. Personalized greeting
                2. Industry-specific hook relating to insurance needs
                3. Value proposition tailored to their industry
                4. Specific offering addressing their potential pain points
                5. Call to action: {call_to_action}
                6. Professional signature
                
                Keep the email concise (150-200 words), professional, and focused on value.
                
                Output format:
                {{"subject": "Email subject line", "body": "Full email body"}}
                """)
            ]
        )
        
        # Prepare the input for the prompt
        input_data = {
            "company_name": prospect.company_name,
            "industry": prospect.industry,
            "contact_person": prospect.contact_person or "Decision Maker",
            "approach": engagement_approach["approach"],
            "tone": engagement_approach["tone"],
            "focus": engagement_approach["focus"],
            "keywords": ", ".join(industry_specifics["keywords"]),
            "pain_points": ", ".join(industry_specifics["pain_points"]),
            "selling_points": ", ".join(industry_specifics["selling_points"]),
            "objection1": objections[0],
            "objection2": objections[1],
            "objection3": objections[2],
            "call_to_action": engagement_approach["call_to_action"]
        }
        
        # Create the chain
        email_chain = email_prompt | self.llm | StrOutputParser()
        
        try:
            # Generate the email
            email_content = await email_chain.ainvoke(input_data)
            
            # Parse the response (assuming it's JSON)
            import json
            email_data = json.loads(email_content)
            
            # Add metadata for further personalization and tracking
            email_data["metadata"] = {
                "industry_specifics": industry_specifics,
                "engagement_approach": engagement_approach,
                "potential_objections": objections
            }
            
            return email_data
            
        except Exception as e:
            print(f"Error generating personalized email: {e}")
            # Fallback to a template-based approach
            return {
                "subject": f"Custom Insurance Solutions for {prospect.company_name}",
                "body": f"""
                Dear {prospect.contact_person or "Decision Maker"},
                
                I hope this email finds you well. I'm reaching out because we've helped several companies in the {prospect.industry} industry optimize their insurance coverage.
                
                Given the specific challenges in your industry like {industry_specifics['pain_points'][0]}, our {industry_specifics['selling_points'][0]} could be particularly valuable to {prospect.company_name}.
                
                Would you be open to a brief call to discuss how our solutions could benefit your business?
                
                Best regards,
                Insurance Specialist
                """
            }
            
    async def generate_engagement_advice(self, prospect: Prospect, email_content: Dict) -> str:
        """
        Generate advice for the sales rep on how to further engage with this prospect.
        """
        advice_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are an expert sales coach specializing in insurance sales."),
                ("human", """
                Provide brief, practical advice for a sales representative on how to follow up with this prospect after sending them an email:
                
                Company: {company_name}
                Industry: {industry}
                Email Subject: {email_subject}
                Email Focus: {email_focus}
                
                Your advice should include:
                1. When to follow up (timing)
                2. Best channel for follow-up (phone, email, LinkedIn)
                3. Talking points tailored to their industry
                4. How to handle likely objections
                
                Keep it concise and actionable, under 100 words.
                """)
            ]
        )
        
        # Prepare the input for the prompt
        input_data = {
            "company_name": prospect.company_name,
            "industry": prospect.industry,
            "email_subject": email_content["subject"],
            "email_focus": email_content["metadata"]["engagement_approach"]["focus"] if "metadata" in email_content else "introduction"
        }
        
        # Create the chain
        advice_chain = advice_prompt | self.llm | StrOutputParser()
        
        try:
            # Generate the advice
            advice = await advice_chain.ainvoke(input_data)
            return advice
            
        except Exception as e:
            print(f"Error generating engagement advice: {e}")
            return """
            Follow up within 3 business days. Use phone for direct contact, then email if no response. 
            Emphasize industry-specific benefits and ROI. Address cost objections by focusing on risk mitigation value.
            """