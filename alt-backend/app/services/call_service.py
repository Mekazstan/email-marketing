import os
from typing import Dict, List, Optional
from twilio.rest import Client
import json
from datetime import datetime
from app.models.prospect import Prospect
from app.models.engagement import Engagement
from sqlalchemy.orm import Session
from app.services.ai_service import AIService


class CallService:
    def __init__(self):
        # Initialize Twilio client
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.client = Client(account_sid, auth_token)
        self.from_phone = os.getenv("FROM_PHONE")
        self.ai_service = AIService()
    
    async def generate_call_script(self, prospect: Prospect, engagement_history: List[Engagement]) -> Dict:
        """
        Generate a call script for the prospect based on their industry and engagement history.
        """
        # This will be similar to the email personalization but tailored for calls
        # For simplicity, we'll reuse the AI service but modify the prompt
        
        # Get industry-specific information
        industry_specifics = self.ai_service._get_industry_specifics(prospect.industry)
        
        # Get engagement-based approach
        engagement_approach = self.ai_service._get_engagement_approach(engagement_history)
        
        # Prepare the prompt for the AI
        prompt = f"""
        Generate a brief cold call script for an insurance sales representative calling {prospect.company_name} in the {prospect.industry} industry.
        
        Company details:
        - Name: {prospect.company_name}
        - Industry: {prospect.industry}
        - Contact Person: {prospect.contact_person or "Decision Maker"}
        
        Approach: {engagement_approach["approach"]}
        Tone: {engagement_approach["tone"]}
        Focus: {engagement_approach["focus"]}
        
        Industry-specific information:
        - Keywords to emphasize: {", ".join(industry_specifics["keywords"])}
        - Industry pain points to address: {", ".join(industry_specifics["pain_points"])}
        - Selling points to highlight: {", ".join(industry_specifics["selling_points"])}
        
        The script should include:
        1. Introduction and purpose of the call
        2. Industry-specific hook
        3. Key qualifying questions
        4. Addressing potential objections
        5. Call to action/next steps
        
        Format the script with clear sections for each part of the conversation and include [[PAUSE]] where the representative should wait for a response.
        Keep it conversational, natural, and under 400 words.
        """
        
        try:
            response = await openai.ChatCompletion.create(
                model=self.ai_service.model,
                messages=[
                    {"role": "system", "content": "You are an expert in writing effective cold call scripts for insurance sales."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
            
            script = response.choices[0].message.content
            
            return {
                "title": f"Call Script for {prospect.company_name}",
                "script": script,
                "metadata": {
                    "industry_specifics": industry_specifics,
                    "engagement_approach": engagement_approach
                }
            }
            
        except Exception as e:
            print(f"Error generating call script: {e}")
            # Fallback to a template-based script
            return {
                "title": f"Call Script for {prospect.company_name}",
                "script": f"""
                Introduction:
                "Hello, may I speak with [Decision Maker]? My name is [Your Name] from [Your Insurance Agency]. 
                
                Purpose:
                I'm calling because we specialize in providing insurance solutions specifically for companies in the {prospect.industry} industry, and I thought {prospect.company_name} might benefit from our services.
                
                Industry Hook:
                We've noticed that businesses in {prospect.industry} often face unique challenges with {industry_specifics['pain_points'][0]}. Is that something you're currently dealing with? [[PAUSE]]
                
                Value Proposition:
                Many of our clients in your industry have found our {industry_specifics['selling_points'][0]} particularly valuable. Would that be of interest to you? [[PAUSE]]
                
                Qualifying Question:
                May I ask who currently handles your insurance needs? [[PAUSE]]
                
                Call to Action:
                I'd love to schedule a brief meeting to discuss how our solutions could specifically benefit {prospect.company_name}. Would you be available for a 15-minute call next week? [[PAUSE]]
                
                Handle Objection (if needed):
                I understand your concern. Many of our clients initially felt the same way. What we've found is that our specialized approach for {prospect.industry} businesses actually [address objection]. [[PAUSE]]
                
                Close:
                Great! I'll send you a calendar invite with some more information. Thank you for your time, and I look forward to speaking with you more about this.
                """
            }
    
    async def make_call(self, db: Session, prospect: Prospect, script_content: Dict) -> Engagement:
        """
        Make a call to a prospect using Twilio and record it in the engagement history.
        
        In a real implementation, this might initiate a call to a sales rep with the script,
        or use text-to-speech to deliver an automated message. For this example, we'll
        simulate the call process.
        """
        if not prospect.phone:
            raise ValueError(f"No phone number for prospect: {prospect.company_name}")
        
        try:
            # In a real application, you would make the actual call here
            # For simulation purposes, we'll just log it
            
            # Record the engagement
            engagement = Engagement(
                prospect_id=prospect.id,
                type="call",
                content=json.dumps(script_content),
                sent_at=datetime.utcnow(),
                opened=True,  # Calls are always "opened"
                clicked=False,
                responded=False,
                engagement_score=2.0,  # Base score for calls
                notes=f"Call script: {script_content['title']}"
            )
            
            db.add(engagement)
            db.commit()
            db.refresh(engagement)
            
            print(f"Call initiated to {prospect.phone} for {prospect.company_name}")
            
            return engagement
            
        except Exception as e:
            print(f"Error making call: {e}")
            db.rollback()
            raise
    
    async def update_call_outcome(self, db: Session, engagement_id: int, outcome: Dict) -> None:
        """
        Update a call engagement with the outcome.
        """
        engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
        if not engagement:
            raise ValueError(f"Engagement with ID {engagement_id} not found")
        
        # Update engagement based on call outcome
        if outcome.get("connected", False):
            engagement.engagement_score += 3.0
        
        if outcome.get("interested", False):
            engagement.responded = True
            engagement.engagement_score += 5.0
        
        engagement.notes = f"{engagement.notes}\nOutcome: {outcome.get('notes', 'No notes')}"
        
        db.commit()
