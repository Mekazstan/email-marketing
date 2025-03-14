from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# Base = declarative_base()

class Prospect(Base):
    __tablename__ = "prospects"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), unique=True, index=True)
    industry = Column(String(100), index=True)
    website = Column(String(255), nullable=True)
    contact_person = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with engagements
    engagements = relationship("Engagement", back_populates="prospect")
