from sqlmodel import Field, SQLModel, create_engine
import os
from dotenv import load_dotenv 
from datetime import datetime
import psycopg2
# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://arkha_user:arkha_password@localhost:5432/arkha_db")
engine = create_engine(DATABASE_URL)
        

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    is_premium: bool
    email: str
    password: str
    created_at: datetime
    updated_at: datetime

def create_table():
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    create_table()
    