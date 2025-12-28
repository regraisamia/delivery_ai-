from api.services.delivery_workflow_simple import DeliveryWorkflow
from api.services.smart_assignment import SmartAssignmentService
import asyncio

class AgentIntegrationService:
    def __init__(self):
        self.workflow = DeliveryWorkflow()
        self.assignment_service = SmartAssignmentService()
        
    async def process_order_with_agents(self, order_data: dict):
        """Process order using AI agents instead of hardcoded logic"""
        print(f"🤖 Starting agent-powered order processing for order: {order_data.get('id', 'unknown')}")
        
        # Use agents for complete workflow
        result = await self.workflow.process_new_order(order_data)
        
        if result["status"] == "success":
            print(f"✅ Order processed successfully using {'AI agents' if result['agents_used'] else 'fallback logic'}")
        else:
            print(f"❌ Order processing failed: {result.get('message')}")
            
        return result
    
    async def assign_driver_with_agents(self, order: dict, available_drivers: list):
        """Use courier management agent for driver assignment"""
        print(f"🚚 Assigning driver using {'AI agents' if self.workflow.agents_available else 'fallback logic'}")
        
        # First use smart assignment for filtering
        best_driver = await self.assignment_service.find_best_driver(order, available_drivers)
        
        if best_driver and self.workflow.agents_available:
            # Let agent validate and confirm assignment
            agent_result = await self.workflow.assign_courier(
                order.get('id', 'unknown'), 
                order.get('pickup_address', 'unknown')
            )
            
            return {
                "driver": best_driver,
                "agent_reasoning": agent_result.get("assignment_reason", "No reasoning provided"),
                "method": "AI Agent + Smart Assignment"
            }
        
        return {
            "driver": best_driver,
            "agent_reasoning": "Fallback assignment logic used",
            "method": "Smart Assignment Only"
        }
    
    async def update_tracking_with_agents(self, order_id: str, status: str, location: str):
        """Use tracking agent for status updates"""
        print(f"📍 Updating tracking using {'AI agents' if self.workflow.agents_available else 'fallback logic'}")
        
        result = await self.workflow.update_delivery_status(order_id, status, location)
        
        return {
            "status": result["status"],
            "description": result["description"],
            "ai_insights": result.get("ai_notes", "No AI insights available"),
            "method": "AI Agent" if self.workflow.agents_available else "Fallback Logic"
        }
    
    async def get_performance_insights(self, order_ids: list):
        """Use monitoring agent for performance analysis"""
        print(f"📊 Analyzing performance using {'AI agents' if self.workflow.agents_available else 'fallback logic'}")
        
        result = await self.workflow.monitor_performance(order_ids)
        
        return {
            "metrics": {
                "total_orders": result["total_orders"],
                "on_time": result["on_time"],
                "delayed": result["delayed"]
            },
            "ai_analysis": result.get("ai_analysis", "No AI analysis available"),
            "method": "AI Agent" if self.workflow.agents_available else "Fallback Logic"
        }
    
    def get_agent_status(self):
        """Get current status of AI agents"""
        return {
            "agents_available": self.workflow.agents_available,
            "llm_model": "ollama/llama3.2" if self.workflow.agents_available else None,
            "fallback_mode": not self.workflow.agents_available,
            "agents": {
                "client_service": "Active" if self.workflow.agents_available else "Fallback",
                "pricing": "Active" if self.workflow.agents_available else "Fallback", 
                "routing": "Active" if self.workflow.agents_available else "Fallback",
                "courier_management": "Active" if self.workflow.agents_available else "Fallback",
                "tracking": "Active" if self.workflow.agents_available else "Fallback"
            }
        }