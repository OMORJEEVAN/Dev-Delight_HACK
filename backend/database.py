from motor.motor_asyncio import AsyncIOMotorClient
import cloudinary
import cloudinary.uploader

MONGO_URL = "mongodb+srv://LAF:anish1613@lostandfound.ihbcue2.mongodb.net/lost_and_found?retryWrites=true&w=majority"

client = AsyncIOMotorClient(MONGO_URL)

db = client["lost_and_found"]

users_collection = db["users"]
items_collection = db["items"]
profliles_collection = db["profiles"]
my_lost_items_collection = db["my_lost_items"]


# Cloudinary configuration

cloudinary.config(
    cloud_name="dvq4xq5mb",
    api_key="159751242623357",
    api_secret="S4oF2miKyiVh4V3v5NgkOVQjF2c"
)