from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from database import items_collection, cloudinary
from schemas import ItemDB

router = APIRouter(tags=["upload"])


@router.post("/upload/")
async def upload_image(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    status: str = Form(...),
    location: str = Form(...)
):
    try:
        # Upload image to Cloudinary
        result = cloudinary.uploader.upload(file.file)
        image_url = result["secure_url"]
        public_id = result["public_id"]   #  IMPORTANT
       
        # Create ItemDB object
        item = ItemDB(
            image_url=image_url,
            public_id=public_id,   #  ADD THIS
            title=title,
            category=category,
            status=status,
            description=description,
            location=location
)
        # Save to MongoDB
        items_collection.insert_one(item.model_dump())

        return {
            "message": "Upload successful",
            "data": item
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))