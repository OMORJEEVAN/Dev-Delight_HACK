from fastapi import APIRouter, HTTPException
from database import users_collection
from schemas import  Signup
from Oauth import get_password_hash

router = APIRouter(tags=["registration"])

@router.post("/signup/")
async def create_blog(request: Signup):
    
    existing_user = await users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_blog = {
        "email": request.email,
        "password": get_password_hash(request.password),
    }
    await users_collection.insert_one(new_blog)

    return {"message": "User created successfully"}