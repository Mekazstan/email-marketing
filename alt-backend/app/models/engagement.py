from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, Text
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

Base = declarative_base()

class Engagement(Base):
    __tablename__ = "engagements"
    
    id = Column(Integer, primary_key=True, index=True)
    prospect_id = Column(Integer, ForeignKey("prospects.id"))
    type = Column(String)  # email, call, meeting, etc.
    content = Column(Text)  # email content or call script
    sent_at = Column(DateTime, default=datetime.utcnow)
    opened = Column(Boolean, default=False)  # For emails
    clicked = Column(Boolean, default=False)  # For emails
    responded = Column(Boolean, default=False)
    engagement_score = Column(Float, default=0.0)  # Calculated engagement level
    notes = Column(Text, nullable=True)  # Additional notes or feedback
    
    # Relationship with prospect
    prospect = relationship("Prospect", back_populates="engagements")
