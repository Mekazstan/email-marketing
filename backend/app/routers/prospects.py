from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
import csv
from io import StringIO

from app.database import get_db
from app.models.prospect import Prospect
from app.schemas.prospect import ProspectCreate, ProspectResponse, ProspectUpdate, ProspectImport
from app.services.workflow_service import WorkflowService

router = APIRouter(
    prefix="/prospects",
    tags=["prospects"],
    responses={404: {"description": "Not found"}},
)

workflow_service = WorkflowService()

@router.post("/", response_model=ProspectResponse, status_code=status.HTTP_201_CREATED)
async def create_prospect(prospect_data: ProspectCreate, db: Session = Depends(get_db)):
    """
    Create a new prospect.
    """
    # Check if prospect exists
    existing_prospect = db.query(Prospect).filter(Prospect.company_name == prospect_data.company_name).first()
    if existing_prospect:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prospect with company name {prospect_data.company_name} already exists"
        )
    
    # Create new prospect
    prospect = Prospect(**prospect_data.dict())
    db.add(prospect)
    db.commit()
    db.refresh(prospect)
    
    return prospect

@router.get("/", response_model=List[ProspectResponse])
async def get_prospects(
    skip: int = 0, 
    limit: int = 100, 
    industry: str = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of prospects with optional filtering by industry.
    """
    query = db.query(Prospect)
    
    if industry:
        query = query.filter(Prospect.industry.ilike(f"%{industry}%"))
    
    prospects = query.offset(skip).limit(limit).all()
    return prospects

@router.get("/{prospect_id}", response_model=ProspectResponse)
async def get_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """
    Get a specific prospect by ID.
    """
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found"
        )
    
    return prospect

@router.put("/{prospect_id}", response_model=ProspectResponse)
async def update_prospect(
    prospect_id: int, 
    prospect_data: ProspectUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update a prospect's information.
    """
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found"
        )
    
    # Update only the fields that are provided
    update_data = prospect_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prospect, key, value)
    
    db.commit()
    db.refresh(prospect)
    
    return prospect

@router.delete("/{prospect_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """
    Delete a prospect.
    """
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found"
        )
    
    db.delete(prospect)
    db.commit()
    
    return None

@router.post("/import", response_model=List[ProspectResponse], status_code=status.HTTP_201_CREATED)
async def import_prospects(prospect_data: ProspectImport, db: Session = Depends(get_db)):
    """
    Import multiple prospects at once.
    """
    created_prospects = []
    
    for p_data in prospect_data.prospects:
        # Check if prospect exists
        existing_prospect = db.query(Prospect).filter(Prospect.company_name == p_data.company_name).first()
        if existing_prospect:
            continue
        
        # Create new prospect
        prospect = Prospect(**p_data.dict())
        db.add(prospect)
        created_prospects.append(prospect)
    
    db.commit()
    
    # Refresh all prospects to get their IDs
    for prospect in created_prospects:
        db.refresh(prospect)
    
    return created_prospects

@router.post("/import-csv", response_model=List[ProspectResponse], status_code=status.HTTP_201_CREATED)
async def import_prospects_csv(
    file: str,  # This would normally be a UploadFile in a real API, but we're simplifying
    db: Session = Depends(get_db)
):
    """
    Import prospects from a CSV file.
    Format: company_name,industry,website,contact_person,email,phone
    """
    created_prospects = []
    
    # Parse CSV from string (in a real API, this would read from the uploaded file)
    csv_reader = csv.DictReader(StringIO(file))
    
    for row in csv_reader:
        # Check if required fields exist
        if "company_name" not in row or "industry" not in row:
            continue
        
        # Check if prospect exists
        existing_prospect = db.query(Prospect).filter(Prospect.company_name == row["company_name"]).first()
        if existing_prospect:
            continue
        
        # Create new prospect
        prospect = Prospect(
            company_name=row["company_name"],
            industry=row["industry"],
            website=row.get("website"),
            contact_person=row.get("contact_person"),
            email=row.get("email"),
            phone=row.get("phone")
        )
        
        db.add(prospect)
        created_prospects.append(prospect)
    
    db.commit()
    
    # Refresh all prospects to get their IDs
    for prospect in created_prospects:
        db.refresh(prospect)
    
    return created_prospects

@router.get("/{prospect_id}/classification", response_model=dict)
async def classify_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """
    Classify a prospect's industry for more specific targeting.
    """
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found"
        )
    
    classification = workflow_service.classify_prospect(prospect)
    
    return {
        "prospect_id": prospect_id,
        "company_name": prospect.company_name,
        "original_industry": prospect.industry,
        "classification": classification
    }
