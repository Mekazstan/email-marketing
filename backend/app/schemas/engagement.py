from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EngagementBase(BaseModel):
    prospect_id: int
    type: str
    content: str
    
class EngagementCreate(EngagementBase):
    pass

class EngagementUpdate(BaseModel):
    opened: Optional[bool] = None
    clicked: Optional[bool] = None
    responded: Optional[bool] = None
    engagement_score: Optional[float] = None
    notes: Optional[str] = None

class EngagementResponse(EngagementBase):
    id: int
    sent_at: datetime
    opened: bool
    clicked: bool
    responded: bool
    engagement_score: float
    notes: Optional[str]
    
    class Config:
        from_attributes = True
