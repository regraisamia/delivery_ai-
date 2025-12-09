from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional

class TrackingEvent(Document):
    order_id: str = Field(index=True)
    status: str
    location: str
    description: str
    agent_name: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "tracking_events"
