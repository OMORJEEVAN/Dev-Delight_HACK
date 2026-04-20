import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://LAF:anish1613@lostandfound.ihbcue2.mongodb.net/lost_and_found?retryWrites=true&w=majority"

async def test_connection():
    try:
        client = AsyncIOMotorClient(MONGO_URL)

        # 🔍 Ping MongoDB server
        result = await client.admin.command("ping")

        print("✅ MongoDB Connected Successfully!")
        print("Response:", result)

    except Exception as e:
        print("❌ MongoDB Connection Failed!")
        print("Error:", e)

# Run the async function
asyncio.run(test_connection())
