from fastapi import APIRouter, HTTPException
from database import users_collection
from schemas import Signup
from Oauth import verify_password, create_access_token

router = APIRouter(tags=["registration"])

@router.post("/login")
async def login(request: Signup):

    # 🔍 Find user
    user = await users_collection.find_one({"email": request.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔐 Check password
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # 🎟 Create JWT token
    token = create_access_token(data={"sub": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }