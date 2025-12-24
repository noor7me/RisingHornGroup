from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field

app = FastAPI()

class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    company: str | None = Field(default=None, max_length=120)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)

@app.get("/api/health")
def health():
    return {"ok": True}

@app.post("/api/contact")
def contact(payload: ContactIn):
    # TODO: wire to email provider (Resend/SendGrid) or storage
    return {"ok": True}
