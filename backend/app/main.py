from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import prospects, emails, calls
from app.database import engine
from app.models import prospect, engagement

# Create database tables
prospect.Base.metadata.create_all(bind=engine)
engagement.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Outreach API",
    description="API for AI-driven cold email personalization for insurance companies",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the allowed origins explicitly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prospects.router)
app.include_router(emails.router)
app.include_router(calls.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI Outreach API",
        "documentation": "/docs",
        "redoc": "/redoc"
    }
