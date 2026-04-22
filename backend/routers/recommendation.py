from fastapi import APIRouter
from Ai.ai_recommendation import get_recommendations
from database import items_collection, my_lost_items_collection
from bson import ObjectId

router = APIRouter()


@router.get("/recommend/{item_id}")
def recommend(item_id: str):

    my_item = my_lost_items_collection.find_one({"_id": ObjectId(item_id)})

    items = list(items_collection.find())

    recommendations = get_recommendations(my_item, items)

    return {
        "recommendations": recommendations
    }