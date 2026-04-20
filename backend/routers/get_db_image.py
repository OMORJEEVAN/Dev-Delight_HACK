from bson import ObjectId
from fastapi import APIRouter, Form, HTTPException
from database import items_collection
from cloudinary.uploader import destroy
from schemas import UpdateItem


router = APIRouter(tags=["items"])


@router.get("/items/")
async def get_items():
    try:
        # ✅ Fetch all items (async)
        items = await items_collection.find().to_list(100)

        # ✅ Convert ObjectId → string
        for item in items:
            item["_id"] = str(item["_id"])

        return items

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.delete("/items/delet/{item_id}")
async def delete_item(item_id: str):
    item = await items_collection.find_one({"_id": ObjectId(item_id)})

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # ✅ delete from Cloudinary
    destroy(item["public_id"])

    # ✅ delete from MongoDB
    await items_collection.delete_one({"_id": ObjectId(item_id)})

    return {"message": "Item and image deleted successfully"}



@router.put("/items/update/{item_id}")
async def update_item(
    item_id: str,
    title: str = Form(None),
    category: str = Form(None),
    status: str = Form(...),
    description: str = Form(None),
):
    # ✅ check if item exists
    existing_item = await items_collection.find_one({"_id": ObjectId(item_id)})

    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # ✅ build update dict manually
    update_dict = {}

    if title is not None:
        update_dict["title"] = title
    if category is not None:
        update_dict["category"] = category
    if description is not None:
        update_dict["description"] = description

    update_dict["status"] = status  # status is required
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No data provided to update")

    # ✅ update in DB
    await items_collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_dict}
    )

    return {"message": "Item updated successfully"}