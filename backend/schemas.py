from typing import Optional
from pydantic import BaseModel


class Login(BaseModel):
   email: str                     
   password: str

class Signup(BaseModel):
   email: str                     
   password: str

class ItemDB(BaseModel):
   image_url: str
   public_id: str  
   title: str
   category: str
   status: str
   location: str
   description: Optional[str] = None

class ItemUpdate(ItemDB):
   last_seen_location: Optional[str] = None
   owner_contact_number: Optional[str] = None
   user_id: str 

class Profile(BaseModel):
   Name: Optional[str] = None
   Institute: str
   Hostle: str
   Passing_Year: str

class ProfileUpdate(BaseModel):
   Name: Optional[str] = None
   Institute: Optional[str] = None
   Hostle: Optional[str] = None
   Passing_Year: Optional[str] = None

class UpdateItem(BaseModel):
   title: Optional[str] = None
   category: Optional[str] = None
   status: str
   description: Optional[str] = None









class Token(BaseModel):
   access_token: str
   token_type: str


class TokenData(BaseModel):
   username: str | None = None


class User(BaseModel):
   email: str
   password: str


class UserInDB(User):
   id: str
   email: str
   password: str