# Multi-Agent Delivery System

A comprehensive AI-powered delivery management system supporting both intra-city and inter-city logistics operations using CrewAI agents.

## 🚀 Features

### Intra-City Deliveries
- **Real-time GPS Tracking** - Live location monitoring
- **Smart Routing** - Optimized local delivery routes
- **Courier Management** - Fleet coordination and assignment
- **Pricing Engine** - Dynamic cost calculation
- **Customer Service** - Automated communication
- **Order Tracking** - End-to-end delivery monitoring

### Inter-City Deliveries
- **Multi-City Logistics** - Cross-city delivery coordination
- **Logistics Hub Management** - Automated transfer points
- **Transportation Coordination** - Multi-modal transport (truck, rail, air)
- **Customs Clearance** - International shipping compliance
- **Warehouse Operations** - Automated sorting and storage
- **Long-Distance Routing** - Highway and logistics optimization

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── api/
│   ├── models/          # MongoDB models (User, Order, Courier, etc.)
│   ├── routes/          # API endpoints
│   │   ├── auth.py      # User authentication
│   │   ├── driver_auth.py # Driver authentication
│   │   ├── orders.py    # Order management
│   │   ├── inter_city.py # Inter-city operations
│   │   └── ...
│   ├── services/        # Business logic
│   │   ├── intra_city_workflow.py
│   │   ├── inter_city_workflow.py
│   │   └── ...
│   └── schemas/         # Pydantic schemas
├── core/
│   ├── auth.py          # JWT authentication
│   ├── config.py        # Settings
│   ├── database.py      # MongoDB connection
│   └── websocket.py     # Real-time updates
└── main.py              # FastAPI application
```

### AI Agents (CrewAI)
```
agents/
├── intra_city/          # Local delivery agents
│   ├── coordinator_agent.py
│   ├── client_service_agent.py
│   ├── pricing_agent.py
│   ├── smart_routing_agent.py
│   ├── courier_management_agent.py
│   └── tracking_monitoring_agent.py
└── inter_city/          # Long-distance delivery agents
    ├── inter_city_coordinator_agent.py
    ├── inter_city_client_service_agent.py
    ├── inter_city_pricing_agent.py
    ├── long_distance_routing_agent.py
    ├── logistics_hub_agent.py
    ├── transportation_coordinator_agent.py
    ├── warehouse_coordinator_agent.py
    └── customs_clearance_agent.py
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Application pages
│   └── services/       # API integration
└── public/             # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB 4.4+
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Multi-agent-delivery-System-main
   ```

2. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Setup MongoDB:**
   - Install MongoDB Community Edition
   - Start MongoDB service: `mongod`
   - Create database: `delivery_system`

4. **Create test users:**
   ```bash
   python create_test_user.py
   python create_test_driver.py
   ```

5. **Start the backend:**
   ```bash
   python main.py
   ```
   Server runs on: http://localhost:8000

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

## 🔐 Authentication

### Test Credentials

**Client Login:**
- Username: `testuser`
- Password: `test123`

**Driver Login:**
- Email: `driver@example.com`
- Password: `driver123`

### API Authentication
All protected endpoints require JWT tokens:
```bash
Authorization: Bearer <jwt_token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/driver/login` - Driver login

### Orders
- `POST /api/orders` - Create delivery order
- `GET /api/orders` - List user orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status

### Inter-City Operations
- `POST /api/inter-city/orders` - Create inter-city order
- `POST /api/inter-city/orders/{id}/monitor` - Monitor delivery
- `GET /api/inter-city/pricing/{origin}/{destination}` - Get pricing
- `GET /api/inter-city/routes/{origin}/{destination}` - Get route info

### Tracking
- `GET /api/tracking/{order_id}` - Track order
- `WebSocket /ws/tracking` - Real-time updates

## 🤖 AI Agent Workflows

### Intra-City Workflow
1. **Order Validation** → Client Service Agent
2. **Pricing Calculation** → Pricing Agent
3. **Route Planning** → Smart Routing Agent
4. **Courier Assignment** → Courier Management Agent
5. **Real-time Tracking** → Tracking Monitoring Agent

### Inter-City Workflow
1. **Order Validation** → Inter-City Client Service Agent
2. **Pricing Calculation** → Inter-City Pricing Agent
3. **Route Planning** → Long Distance Routing Agent
4. **Hub Assignment** → Logistics Hub Agent
5. **Transportation** → Transportation Coordinator Agent
6. **Customs (if international)** → Customs Clearance Agent
7. **Monitoring** → Real-time tracking across cities

## 🗄️ Database Schema

### Collections
- **users** - Customer accounts
- **couriers** - Delivery drivers
- **orders** - Delivery orders
- **tracking_events** - GPS tracking data
- **delivery_analytics** - Performance metrics

### Key Models
```python
class User(Document):
    email: str
    username: str
    hashed_password: str
    role: UserRole
    is_active: bool

class Order(Document):
    customer_id: PydanticObjectId
    pickup_address: str
    delivery_address: str
    status: OrderStatus
    total_cost: float
    order_type: str  # 'intra_city' or 'inter_city'
```

## 🚀 Deployment

### Production Setup
1. **Environment Variables:**
   ```bash
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=delivery_system
   SECRET_KEY=your-production-secret-key
   ```

2. **Database Migration:**
   ```bash
   python reset_orders.py  # Reset database if needed
   ```

3. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

4. **Production Server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_connection.py  # Test MongoDB connection
```

### API Testing
Use tools like Postman or curl:
```bash
# Login test
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

## 📊 Monitoring & Analytics

- **Real-time Dashboards** - Order status and agent performance
- **Delivery Analytics** - Success rates, delivery times
- **Agent Performance** - Task completion metrics
- **Route Optimization** - Efficiency improvements

## 🔧 Configuration

### Core Settings (`backend/core/config.py`)
```python
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "delivery_system"
SECRET_KEY = "your-secret-key"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
```

### Agent Configuration
Each agent can be configured with:
- Model selection (GPT-4, Claude, etc.)
- Temperature settings
- Custom prompts
- Task-specific parameters

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-agent`
3. Commit changes: `git commit -am 'Add new agent'`
4. Push to branch: `git push origin feature/new-agent`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Create an issue on GitHub

## 🚀 Future Enhancements

- **Mobile App** - React Native driver app
- **Advanced Analytics** - ML-powered predictions
- **Multi-language Support** - Internationalization
- **Payment Integration** - Stripe/PayPal
- **Real-time Notifications** - Push notifications
- **IoT Integration** - Smart lockers and sensors

---

**Built with:** FastAPI, React, MongoDB, CrewAI, Tailwind CSS
