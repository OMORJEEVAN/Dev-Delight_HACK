from fastapi import FastAPI
import authentication
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# ✅ CORS (must be here)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routers
from routers import login,singup,upload,get_db_image,profile

app.include_router(singup.router)
app.include_router(login.router)
app.include_router(authentication.router)
app.include_router(upload.router)
app.include_router(get_db_image.router)
app.include_router(profile.router)