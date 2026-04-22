from fastapi import APIRouter, HTTPException
from bson import ObjectId
import sys
import os

# Fix import path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from database import my_lost_items_collection, items_collection
from Ai.ai_recommendation import get_recommendations

router = APIRouter(tags=["recommendation"])


def serialize(item):
    item["_id"] = str(item["_id"])
    return item


@router.get("/recommendations/{item_id}")
async def get_ai_recommendations(item_id: str):

    # 🔹 get my item
    my_item = await my_lost_items_collection.find_one({"_id": ObjectId(item_id)})

    if not my_item:
        raise HTTPException(status_code=404, detail="Item not found")

    my_item = serialize(my_item)

    # 🔹 get all items
    cursor = items_collection.find({})
    items_list = []

    async for item in cursor:
        items_list.append(serialize(item))

    # 🔹 AI
    recommendations = get_recommendations(my_item, items_list)

    return {
        "my_item": my_item,
        "recommendations": recommendations
    }