from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prospect import Prospect
from app.models.engagement import Engagement
from app.services.call_service import CallService

router = APIRouter(
    prefix="/calls",
    tags=["calls"],
    responses={404: {"description": "Not found"}},
)

call_service = CallService()

@router.post("/generate-script", response_model=Dict)
async def generate_call_script(prospect_id: int, db: Session = Depends(get_db)):
    """
    Generate a personalized call script for a prospect without making a call.
    """
    try:
        # Get the prospect
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if not prospect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prospect with ID {prospect_id} not found"
            )
        
        # Get engagement history
        engagement_history = db.query(Engagement).filter(
            Engagement.prospect_id == prospect_id
        ).order_by(Engagement.sent_at.desc()).all()
        
        # Generate call script
        script_content = await call_service.generate_call_script(prospect, engagement_history)
        
        return {
            "prospect_id": prospect_id,
            "company_name": prospect.company_name,
            "industry": prospect.industry,
            "script_title": script_content["title"],
            "script_content": script_content["script"]
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate call script: {str(e)}"
        )

@router.post("/make-call", response_model=Dict)
async def make_call(prospect_id: int, db: Session = Depends(get_db)):
    """
    Generate a script and initiate a call to a prospect.
    """
    try:
        # Get the prospect
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if not prospect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prospect with ID {prospect_id} not found"
            )
        
        if not prospect.phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No phone number available for prospect {prospect.company_name}"
            )
        
        # Get engagement history
        engagement_history = db.query(Engagement).filter(
            Engagement.prospect_id == prospect_id
        ).order_by(Engagement.sent_at.desc()).all()
        
        # Generate call script
        script_content = await call_service.generate_call_script(prospect, engagement_history)
        
        # Make the call
        engagement = await call_service.make_call(db, prospect, script_content)
        
        return {
            "prospect_id": prospect_id,
            "company_name": prospect.company_name,
            "industry": prospect.industry,
            "script_title": script_content["title"],
            "script_content": script_content["script"],
            "engagement_id": engagement.id,
            "call_initiated_at": engagement.sent_at
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to make call: {str(e)}"
        )

@router.post("/update-outcome", response_model=Dict)
async def update_call_outcome(engagement_id: int, outcome: Dict, db: Session = Depends(get_db)):
    """
    Update the outcome of a call after it's completed.
    """
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement or engagement.type != "call":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Call engagement with ID {engagement_id} not found"
        )
    
    try:
        await call_service.update_call_outcome(db, engagement_id, outcome)
        
        # Refresh the engagement to get updated data
        db.refresh(engagement)
        
        return {
            "engagement_id": engagement_id,
            "status": "updated",
            "engagement_score": engagement.engagement_score,
            "notes": engagement.notes
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update call outcome: {str(e)}"
        )
