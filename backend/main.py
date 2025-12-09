from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from core.database import connect_db, close_db
from api.routes import orders, tracking, pricing, agents, auth, delivery, courier, analytics, driver_auth, inter_city
from core.websocket import manager
import asyncio

app = FastAPI(title="Multi-Agent Delivery System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        await connect_db()
        print("[OK] Connected to MongoDB")
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        print("[INFO] Install MongoDB: choco install mongodb")
        print("[INFO] Start MongoDB: net start MongoDB")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

app.include_router(auth.router)
app.include_router(driver_auth.router)
app.include_router(orders.router)
app.include_router(tracking.router)
app.include_router(pricing.router)
app.include_router(agents.router)
app.include_router(delivery.router)
app.include_router(courier.router)
app.include_router(analytics.router)
app.include_router(inter_city.router)

@app.get("/")
def root():
    return {"message": "Multi-Agent Delivery System API"}

@app.websocket("/ws/tracking")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"type": "tracking_update", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    print("Starting Multi-Agent Delivery System API...")
    print("Backend running on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
