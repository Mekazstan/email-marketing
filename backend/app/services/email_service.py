import os
from typing import Dict, List, Optional
from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from datetime import datetime
from app.models.prospect import Prospect
from app.models.engagement import Engagement
from sqlalchemy.orm import Session
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        # Initialize FastAPI-Mail configuration
        self.mail_config = ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
            MAIL_FROM=os.getenv("FROM_EMAIL", "insurance@youragency.com"),
            MAIL_FROM_NAME=os.getenv("FROM_NAME", "Insurance Specialist"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.yourmailserver.com"),
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True,
        )
        self.fast_mail = FastMail(config=self.mail_config)
    
    async def send_email(self, db: Session, prospect: Prospect, email_content: Dict) -> Engagement:
        """
        Send a personalized email to a prospect and record it in the engagement history.
        """
        if not prospect.email:
            raise ValueError(f"No email address for prospect: {prospect.company_name}")
        
        # Create the email message
        message = MessageSchema(
            recipients=[prospect.email],
            subject=email_content["subject"],
            body=self._format_html_email(email_content["body"]),
            subtype=MessageType.html
        )
        
        try:
            # Send the email
            logger.debug(f"Sending email to {prospect.email} with subject: {email_content['subject']}")
            response = await self.fast_mail.send_message(message)
            print(f"Email sent to {prospect.email}")
            logger.debug(f"Email sent successfully to {prospect.email}")
            
            # Record the engagement
            engagement = Engagement(
                prospect_id=prospect.id,
                type="email",
                content=email_content["body"],
                sent_at=datetime.utcnow(),
                opened=False,
                clicked=False,
                responded=False,
                engagement_score=0.0,
                notes=f"Subject: {email_content['subject']}"
            )
            
            db.add(engagement)
            db.commit()
            db.refresh(engagement)
            
            return engagement
            
        except Exception as e:
            print(f"Error sending email: {e}")
            db.rollback()
            raise
    
    def _format_html_email(self, body_text: str) -> str:
        """
        Format the email body as HTML with proper styling.
        """
        # Convert line breaks to HTML breaks
        body_html = body_text.replace('\n', '<br>')
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .footer {{ font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }}
                .signature {{ margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                {body_html}
                
                <div class="signature">
                    <strong>{os.getenv("FROM_NAME", "Insurance Specialist")}</strong><br>
                    Insurance Specialist<br>
                    Phone: {os.getenv("CONTACT_PHONE", "(555) 123-4567")}<br>
                    Email: {os.getenv("FROM_EMAIL", "insurance@youragency.com")}
                </div>
                
                <div class="footer">
                    This email is intended only for the addressee and may contain confidential information. 
                    If you are not the intended recipient, please delete this email and notify the sender.
                </div>
            </div>
        </body>
        </html>
        """
        
        return html
    
    async def track_engagement(self, db: Session, engagement_id: int, event_type: str) -> None:
        """
        Track email engagement events (open, click, reply)
        """
        engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
        if not engagement:
            raise ValueError(f"Engagement with ID {engagement_id} not found")
        
        if event_type == "open":
            engagement.opened = True
            engagement.engagement_score += 1.0
        elif event_type == "click":
            engagement.clicked = True
            engagement.engagement_score += 2.0
        elif event_type == "reply":
            engagement.responded = True
            engagement.engagement_score += 5.0
        
        db.commit()
