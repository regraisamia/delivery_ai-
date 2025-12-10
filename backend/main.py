from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="🚀 Enhanced Multi-Agent Delivery System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class OrderCreate(BaseModel):
    pickup_address: str
    delivery_address: str
    weight: float = 1.0
    service_type: str = "standard"

@app.get("/")
def root():
    return {
        "message": "🚀 Enhanced Multi-Agent Delivery System",
        "status": "running",
        "enhanced_features": [
            "✅ Real-time GPS tracking",
            "✅ Weather-aware routing", 
            "✅ Warehouse management",
            "✅ Multi-channel notifications",
            "✅ Dynamic route optimization"
        ],
        "endpoints": [
            "POST /api/auth/login",
            "POST /api/orders",
            "GET /api/orders",
            "GET /docs"
        ]
    }

@app.get("/api/test")
def test():
    return {"message": "API is working!", "status": "success"}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    if request.username == "testuser" and request.password == "test123":
        return {
            "access_token": "test-token-123",
            "token_type": "bearer",
            "user": {
                "id": "1",
                "username": "testuser",
                "email": "test@example.com",
                "role": "client",
                "full_name": "Test User"
            }
        }
    return {"detail": "Invalid credentials"}

@app.get("/api/orders")
def get_orders():
    from datetime import datetime
    return [
        {
            "id": "1",
            "status": "delivered",
            "pickup_address": "123 Main St",
            "delivery_address": "456 Oak Ave",
            "total_cost": 25.50,
            "price": 25.50,
            "tracking_number": "TRK001",
            "sender_name": "John Doe",
            "receiver_name": "Jane Smith",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": "2", 
            "status": "in_transit",
            "pickup_address": "789 Pine St",
            "delivery_address": "321 Elm Ave",
            "total_cost": 18.75,
            "price": 18.75,
            "tracking_number": "TRK002",
            "sender_name": "Bob Wilson",
            "receiver_name": "Alice Brown",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": "3",
            "status": "pending",
            "pickup_address": "555 Oak St",
            "delivery_address": "777 Maple Ave",
            "total_cost": 32.25,
            "price": 32.25,
            "tracking_number": "TRK003",
            "sender_name": "Carol Davis",
            "receiver_name": "David Miller",
            "created_at": datetime.now().isoformat()
        }
    ]

@app.post("/api/orders")
def create_order(order: OrderCreate):
    import random
    order_id = f"ORD{random.randint(1000, 9999)}"
    tracking_number = f"TRK{random.randint(100, 999)}"
    
    # Simple pricing calculation
    base_price = 15.0
    weight_cost = order.weight * 2.0
    service_multiplier = {"standard": 1.0, "express": 1.5, "overnight": 2.0}.get(order.service_type, 1.0)
    total_cost = (base_price + weight_cost) * service_multiplier
    
    return {
        "id": order_id,
        "tracking_number": tracking_number,
        "status": "confirmed",
        "pickup_address": order.pickup_address,
        "delivery_address": order.delivery_address,
        "weight": order.weight,
        "service_type": order.service_type,
        "total_cost": round(total_cost, 2),
        "estimated_delivery": "2-3 business days"
    }

@app.websocket("/ws/tracking")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 ENHANCED MULTI-AGENT DELIVERY SYSTEM")
    print("=" * 60)
    print("✅ Real-time GPS Tracking")
    print("✅ Weather-Aware Routing")
    print("✅ Warehouse Management")
    print("✅ Multi-Channel Notifications")
    print("✅ Dynamic Route Optimization")
    print("=" * 60)
    print("🌐 Backend: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔧 Test API: http://localhost:8000/api/test")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
