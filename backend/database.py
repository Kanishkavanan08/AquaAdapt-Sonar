from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# Creates a local SQLite file named aqua_adapt.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./aqua_adapt.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class DecisionLog(Base):
    __tablename__ = "decision_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, default=lambda: datetime.now().strftime("%H:%M:%S"))
    
    # Environment
    depth_m = Column(Float)
    battery = Column(Float)
    noise = Column(String)
    
    # AI Decision
    freq_khz = Column(Float)
    waveform = Column(String)
    power = Column(Float)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()