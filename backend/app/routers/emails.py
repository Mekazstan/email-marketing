from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Dict
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prospect import Prospect
from app.models.engagement import Engagement
from app.schemas.email import EmailRequest, EmailResponse, EmailBulkRequest
from app.services.workflow_service import WorkflowService

router = APIRouter(
    prefix="/emails",
    tags=["emails"],
    responses={404: {"description": "Not found"}},
)

workflow_service = WorkflowService()

@router.post("/generate", response_model=Dict)
async def generate_email(prospect_id: int, db: Session = Depends(get_db)):
    """
    Generate a personalized email for a prospect without sending it.
    """
    try:
        result = await workflow_service.process_prospect(db, prospect_id)
        
        return {
            "prospect_id": prospect_id,
            "company_name": result["prospect"].company_name,
            "industry": result["prospect"].industry,
            "email_subject": result["email_content"]["subject"],
            "email_body": result["email_content"]["body"],
            "engagement_advice": result["engagement_advice"]
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate email: {str(e)}"
        )

@router.post("/send", response_model=Dict)
async def send_email(prospect_id: int, db: Session = Depends(get_db)):
    """
    Generate and send a personalized email to a prospect.
    """
    try:
        result = await workflow_service.send_personalized_email(db, prospect_id)
        
        return {
            "prospect_id": prospect_id,
            "company_name": result["prospect"].company_name,
            "industry": result["prospect"].industry,
            "email_subject": result["email_content"]["subject"],
            "email_body": result["email_content"]["body"],
            "engagement_advice": result["engagement_advice"],
            "engagement_id": result["engagement"].id,
            "sent_at": result["engagement"].sent_at
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )

@router.post("/send-batch", response_model=List[Dict])
async def send_batch_emails(request: EmailBulkRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Generate and send personalized emails to multiple prospects as a background task.
    """
    # Validate that prospects exist
    for prospect_id in request.prospect_ids:
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if not prospect:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prospect with ID {prospect_id} not found"
            )
    
    # Add the task to background tasks
    background_tasks.add_task(
        workflow_service.send_batch_emails,
        db,
        request.prospect_ids
    )
    
    return [{"prospect_id": pid, "status": "processing"} for pid in request.prospect_ids]

@router.get("/engagement/{engagement_id}", response_model=Dict)
async def get_email_engagement(engagement_id: int, db: Session = Depends(get_db)):
    """
    Get the engagement data for a specific email.
    """
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement or engagement.type != "email":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email engagement with ID {engagement_id} not found"
        )
    
    prospect = db.query(Prospect).filter(Prospect.id == engagement.prospect_id).first()
    
    return {
        "engagement_id": engagement.id,
        "prospect_id": engagement.prospect_id,
        "company_name": prospect.company_name if prospect else "Unknown",
        "sent_at": engagement.sent_at,
        "opened": engagement.opened,
        "clicked": engagement.clicked,
        "responded": engagement.responded,
        "engagement_score": engagement.engagement_score,
        "notes": engagement.notes
    }

@router.post("/engagement/{engagement_id}/track", response_model=Dict)
async def track_email_engagement(engagement_id: int, event_type: str, db: Session = Depends(get_db)):
    """
    Track email engagement events (open, click, reply).
    """
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement or engagement.type != "email":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email engagement with ID {engagement_id} not found"
        )
    
    if event_type not in ["open", "click", "reply"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid event type: {event_type}. Must be 'open', 'click', or 'reply'"
        )
    
    # Update the engagement
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
    
    return {
        "engagement_id": engagement.id,
        "event_type": event_type,
        "status": "success",
        "engagement_score": engagement.engagement_score
    }
