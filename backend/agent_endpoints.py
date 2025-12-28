@app.get("/api/agents/status")
def get_agent_status():
    """Get current status of AI agents"""
    from api.services.agent_integration import AgentIntegrationService
    agent_service = AgentIntegrationService()
    return agent_service.get_agent_status()

@app.get("/api/agents/test")
async def test_agents():
    """Test agent functionality with sample data"""
    from api.services.agent_integration import AgentIntegrationService
    agent_service = AgentIntegrationService()
    
    test_order = {
        'id': 'TEST001',
        'sender_name': 'Test Sender',
        'receiver_name': 'Test Receiver', 
        'sender_address': 'Casablanca Center',
        'receiver_address': 'Rabat Center',
        'weight': 2.5,
        'service_type': 'express',
        'distance': 87
    }
    
    result = await agent_service.process_order_with_agents(test_order)
    
    return {
        "test_order": test_order,
        "agent_result": result,
        "agent_status": agent_service.get_agent_status()
    }