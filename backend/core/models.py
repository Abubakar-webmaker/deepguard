from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DetectionType(str, Enum):
    image = "image"
    audio = "audio"
    text = "text"

class Verdict(str, Enum):
    real = "real"
    fake = "fake"
    uncertain = "uncertain"

# ─── Auth Models ───────────────────────────────────────
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=60)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# ─── Detection Models ──────────────────────────────────
class Signal(BaseModel):
    name: str
    value: float
    description: str

class DetectionResponse(BaseModel):
    id: str
    type: DetectionType
    file_name: Optional[str] = None
    verdict: Verdict
    confidence: float
    ai_probability: float
    signals: List[Signal]
    analysis_time: float
    timestamp: datetime

# ─── History Models ────────────────────────────────────
class HistoryItem(BaseModel):
    id: str
    type: DetectionType
    file_name: Optional[str]
    verdict: Verdict
    confidence: float
    timestamp: datetime