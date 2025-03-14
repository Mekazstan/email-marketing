from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/ai_outreach")
# URL for MySQL database
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/ai_outreach")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
