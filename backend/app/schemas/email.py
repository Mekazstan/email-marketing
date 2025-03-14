from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class EmailBase(BaseModel):
    subject: str
    body: str
    
class EmailTemplate(EmailBase):
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None

class EmailRequest(BaseModel):
    prospect_id: int
    template_id: Optional[int] = None
    custom_subject: Optional[str] = None
    custom_body: Optional[str] = None
    
class EmailResponse(BaseModel):
    id: int
    prospect_id: int
    subject: str
    body: str
    sent_at: datetime
    engagement_score: Optional[float] = None
    personalization_data: Optional[Dict] = None
    
    class Config:
        from_attributes = True

class EmailBulkRequest(BaseModel):
    prospect_ids: List[int]
    template_id: Optional[int] = None
