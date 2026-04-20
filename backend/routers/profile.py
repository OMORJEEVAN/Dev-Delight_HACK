from bson import ObjectId
from fastapi import APIRouter, Depends, Form, HTTPException, File, UploadFile
from schemas import ItemUpdate, Profile, ProfileUpdate
from Oauth import get_current_user
from database import profliles_collection, my_lost_items_collection
import cloudinary.uploader
from cloudinary.uploader import destroy

router = APIRouter(tags=["Profile"])

@router.post("/profile/")
async def create_profile(
    request: Profile,
    current_user: dict = Depends(get_current_user)
):
    try:
        # 🔥 check if profile already exists
        existing = await profliles_collection.find_one(
            {"user_id": current_user.id}
        )

        if existing:
            raise HTTPException(status_code=400, detail="Profile already exists")

        new_profile = {
            "user_id": current_user.id,   # ✅ IMPORTANT FIX
            "Name": request.Name,
            "Institute": request.Institute,
            "Hostle": request.Hostle,
            "Passing_Year": request.Passing_Year
        }

        await profliles_collection.insert_one(new_profile)

        return {"message": "Profile created successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/all")
async def get_all_profiles():
    try:
        profiles_cursor = profliles_collection.find()

        profiles = []
        async for profile in profiles_cursor:
            profile["_id"] = str(profile["_id"])  # Convert ObjectId → string
            profiles.append(profile)

        return profiles

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.put("/profile/update")
async def update_profile(
    Name: str = Form(None),
    Institute: str = Form(None),
    Hostle: str = Form(None),
    Passing_Year: str = Form(None),
):
    try:
        updated_data = ProfileUpdate(
            Name=Name,
            Institute=Institute,
            Hostle=Hostle,
            Passing_Year=Passing_Year
        )

        updated_dict = {
            k: v for k, v in updated_data.model_dump().items() if v is not None
        }

        if not updated_dict:
            raise HTTPException(status_code=400, detail="No fields provided")

        result = await profliles_collection.update_one(
            {},   #matches first document
            {"$set": updated_dict}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")

        return {"message": "Profile updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.post("/profile/your_lost_item")
async def upload_image(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    status: str = Form(...),
    last_seen_location: str = Form(None),
    owner_contact_number: str = Form(None),
    current_user=Depends(get_current_user)
):
    try:
        # Upload image to Cloudinary
        result = cloudinary.uploader.upload(file.file)
        image_url = result["secure_url"]
        public_id = result["public_id"]   # ✅ IMPORTANT
       
        # Create ItemDB object
        item = ItemUpdate(
            image_url=image_url,
            public_id=public_id,   # ✅ ADD THIS
            title=title,
            category=category,
            status=status,
            location=last_seen_location,
            owner_contact_number=owner_contact_number,
            description=description,
            user_id=current_user.id
        )
        # Save to MongoDB
        my_lost_items_collection.insert_one(item.model_dump())

        return {
            "message": "Upload successful",
            "data": item
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    

@router.get("/profile/your_lost_item/all")
async def get_your_lost_items():
    try:
        # ✅ Fetch all items (async)
        items = await my_lost_items_collection.find().to_list(100)

        # ✅ Convert ObjectId → string
        for item in items:
            item["_id"] = str(item["_id"])

        return items

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# 🗑️ DELETE ITEM
@router.delete("/items/your_lost_items/delete/{item_id}")
async def delete_item(item_id: str, current_user=Depends(get_current_user)):
    try:
        # 🔍 Find item
        item = await my_lost_items_collection.find_one({
            "_id": ObjectId(item_id)
        })

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        # ⚠️ Check user_id exists
        if "user_id" not in item:
            raise HTTPException(status_code=400, detail="Invalid item data (missing user_id)")

        # 🔐 Owner check
        if item["user_id"] != current_user.id:         #✅ FIXED: str() removed
            raise HTTPException(status_code=403, detail="Not authorized")

        # 🗑️ Delete image from Cloudinary
        if "public_id" in item:
            destroy(item["public_id"])

        # 🗑️ Delete from DB
        await my_lost_items_collection.delete_one({
            "_id": ObjectId(item_id)
        })

        return {"message": "Item deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✏️ UPDATE ITEM (FORM VERSION)
@router.put("/items/your_lost_items/update/{item_id}")
async def update_item(
    item_id: str,
    title: str = Form(None),
    category: str = Form(None),
    status: str = Form(None),
    description: str = Form(None),
    last_seen_location: str = Form(None),
    owner_contact_number: str = Form(None),
    current_user=Depends(get_current_user)
):
    try:
        # 🔍 Find item
        item = await my_lost_items_collection.find_one({
            "_id": ObjectId(item_id)
        })

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        # ⚠️ Check user_id exists
        if "user_id" not in item:
            raise HTTPException(status_code=400, detail="Invalid item data (missing user_id)")

        # 🔐 Owner check
        if item["user_id"] != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")

        # 🧠 Build update dict dynamically
        updated_data = {}

        if title is not None:
            updated_data["title"] = title
        if category is not None:
            updated_data["category"] = category
        if status is not None:
            updated_data["status"] = status
        if description is not None:
            updated_data["description"] = description
        if last_seen_location is not None:
            updated_data["last_seen_location"] = last_seen_location
        if owner_contact_number is not None:
            updated_data["owner_contact_number"] = owner_contact_number

        # 📝 Update item
        await my_lost_items_collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": updated_data}
        )

        return {"message": "Item updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))