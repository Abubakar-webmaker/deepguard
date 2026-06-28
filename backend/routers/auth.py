from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from core.database import get_db
from core.security import hash_password, verify_password, create_access_token, decode_token
from core.models import UserRegister, UserLogin, TokenResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    db = get_db()
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(data: UserRegister):
    db = get_db()

    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "_id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "created_at": datetime.utcnow(),
        "scan_count": 0,
        "plan": "free"
    }

    await db.users.insert_one(user_doc)

    token = create_access_token({"sub": data.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_doc["_id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "plan": user_doc["plan"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()

    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": data.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "plan": user["plan"]
        }
    }

@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "plan": current_user["plan"],
        "scan_count": current_user.get("scan_count", 0)
    }