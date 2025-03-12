import os
from email import send_email
from chain import full_workflow
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 Scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic Models
class Prospect(BaseModel):
    company_name: str
    industry: str
    engagement_level: str
    objections: List[str]
    email: Optional[str] = None

class EmailRequest(BaseModel):
    prospect: Prospect
    email_content: str

# Google OAuth Verification
async def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
        return idinfo
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    user_info = await verify_google_token(token)
    return user_info



# Routes
@app.post("/generate-email")
async def generate_email(prospect: Prospect, current_user: dict = Depends(get_current_user)):
    """
    Generate a personalized email and follow-up advice.
    """
    try:
        result = full_workflow(prospect.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/send-email")
async def send_email_route(email_request: EmailRequest, current_user: dict = Depends(get_current_user)):
    """
    Send the generated email to the prospect's email address.
    """
    try:
        send_email(
            subject="Tailored Insurance Solutions",
            body=email_request.email_content,
            to_email=email_request.prospect.email
        )
        return {"status": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

