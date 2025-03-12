from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.prospect import Prospect
from app.models.engagement import Engagement
from app.services.ai_service import AIService
from app.services.email_service import EmailService
import asyncio


class WorkflowService:
    def __init__(self):
        self.ai_service = AIService()
        self.email_service = EmailService()
    
    async def process_prospect(self, db: Session, prospect_id: int) -> Dict:
        """
        Process a single prospect through the personalization workflow.
        
        Returns a dictionary with the email content and engagement advice.
        """
        # Get the prospect
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if not prospect:
            raise ValueError(f"Prospect with ID {prospect_id} not found")
        
        # Get engagement history
        engagement_history = db.query(Engagement).filter(
            Engagement.prospect_id == prospect_id
        ).order_by(Engagement.sent_at.desc()).all()
        
        # Generate personalized email content
        email_content = await self.ai_service.generate_personalized_email(prospect, engagement_history)
        
        # Generate engagement advice
        engagement_advice = await self.ai_service.generate_engagement_advice(prospect, email_content)
        
        return {
            "prospect": prospect,
            "email_content": email_content,
            "engagement_advice": engagement_advice
        }
    
    async def send_personalized_email(self, db: Session, prospect_id: int) -> Dict:
        """
        Process a prospect and send them a personalized email.
        
        Returns the processed data and the engagement record.
        """
        # Process the prospect
        processed_data = await self.process_prospect(db, prospect_id)
        
        # Send the email
        engagement = await self.email_service.send_email(
            db, 
            processed_data["prospect"], 
            processed_data["email_content"]
        )
        
        return {
            **processed_data,
            "engagement": engagement
        }
    
    async def process_batch(self, db: Session, prospect_ids: List[int]) -> List[Dict]:
        """
        Process multiple prospects in parallel.
        """
        tasks = [self.process_prospect(db, prospect_id) for prospect_id in prospect_ids]
        return await asyncio.gather(*tasks)
    
    async def send_batch_emails(self, db: Session, prospect_ids: List[int]) -> List[Dict]:
        """
        Process and send emails to multiple prospects in sequence.
        """
        results = []
        for prospect_id in prospect_ids:
            try:
                result = await self.send_personalized_email(db, prospect_id)
                results.append(result)
            except Exception as e:
                print(f"Error processing prospect {prospect_id}: {e}")
                results.append({"prospect_id": prospect_id, "error": str(e)})
        
        return results
    
    def classify_prospect(self, prospect: Prospect) -> str:
        """
        Classify a prospect into an industry category for more specific targeting.
        This is a simple classification - in a real application, we might use NLP or taxonomy mapping.
        """
        industry_lower = prospect.industry.lower()
        
        if any(tech in industry_lower for tech in ["tech", "software", "it", "computer", "digital"]):
            return "technology"
        elif any(fin in industry_lower for fin in ["financ", "bank", "invest", "insur", "capital"]):
            return "finance"
        elif any(health in industry_lower for health in ["health", "medical", "hospital", "pharma", "care"]):
            return "healthcare"
        elif any(retail in industry_lower for retail in ["retail", "shop", "store", "ecommerce", "commerce"]):
            return "retail"
        elif any(manu in industry_lower for manu in ["manufactur", "factory", "production", "industrial"]):
            return "manufacturing"
        else:
            return "other"
