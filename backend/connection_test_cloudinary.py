import asyncio
import cloudinary
import cloudinary.api

# 🔑 Configure Cloudinary
cloudinary.config(
    cloud_name="dvq4xq5mb",
    api_key="159751242623357",
    api_secret="S4oF2miKyiVh4V3v5NgkOVQjF2c"
)

async def test_cloudinary():
    try:
        # 🔍 Fetch account info (no upload)
        result = cloudinary.api.ping()

        print("✅ Cloudinary Connected Successfully!")
        print("Response:", result)

    except Exception as e:
        print("❌ Cloudinary Connection Failed!")
        print("Error:", e)

# Run async function
asyncio.run(test_cloudinary())