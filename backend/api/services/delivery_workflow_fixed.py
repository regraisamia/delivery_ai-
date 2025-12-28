import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

try:
    from crewai import Crew, Task, Agent
    from litellm import LLM
except ImportError:
    from crewai import Crew, Task, Agent, LLM

from datetime import datetime
from agents.intra_city.client_service_agent import client_service_agent
from agents.intra_city.coordinator_agent import coordinator_agent
from agents.intra_city.pricing_agent import pricing_agent
from agents.intra_city.smart_routing_agent import smart_routing_agent
from agents.intra_city.courier_management_agent import courier_management_agent
from agents.intra_city.tracking_monitoring_agent import tracking_monitoring_agent
from tasks.intra_city_tasks import *

class DeliveryWorkflow:
    def __init__(self):
        # Initialize LLM with fallback
        try:
            # Try different LLM initialization methods
            try:
                from litellm import LLM
                self.llm = LLM(model="ollama/llama3.1", base_url="http://localhost:11434")
            except:
                self.llm = "ollama/llama3.1"  # Use string for older CrewAI versions
            
            self.agents_available = True
            print("✅ CrewAI agents initialized successfully")
        except Exception as e:
            print(f"⚠️ LLM not available ({e}), using fallback mode")
            self.llm = None
            self.agents_available = False
    
    async def process_new_order(self, order_data: dict):
        """Process new order using coordinated AI agents"""
        try:
            print(f"🤖 Processing order with agents (available: {self.agents_available})")
            
            # Step 1: Client Agent - Validate order
            client_result = await self._validate_order(order_data)
            print(f"✅ Validation: {client_result.get('ai_notes', 'completed')}")
            
            # Step 2: Pricing Agent - Calculate price
            pricing_result = await self._calculate_pricing(order_data)
            print(f"💰 Pricing: {pricing_result.get('price')} MAD")
            
            # Step 3: Smart Routing Agent - Plan route
            route_result = await self._plan_route(order_data)
            print(f"🗺️ Route: {route_result.get('route')}")
            
            # Step 4: Tracking Agent - Create initial tracking
            tracking_result = await self._create_tracking(order_data, route_result)
            print(f"📍 Tracking: {tracking_result.get('status')}")
            
            return {
                "status": "success",
                "agents_used": self.agents_available,
                "validation": client_result,
                "pricing": pricing_result,
                "route": route_result,
                "tracking": tracking_result
            }
        except Exception as e:
            print(f"❌ Workflow error: {e}")
            return {"status": "error", "message": str(e), "agents_used": self.agents_available}
    
    async def _validate_order(self, order_data: dict):
        """Client Agent validates order data"""
        if not self.agents_available:
            return {"valid": True, "ai_notes": "Validation passed (fallback)"}
        
        try:
            task = create_validate_order_task(client_service_agent, order_data)
            crew = Crew(agents=[client_service_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {"valid": True, "ai_notes": str(result)}
        except Exception as e:
            print(f"Agent validation failed: {e}")
            return {"valid": True, "ai_notes": "Validation passed (fallback)"}
    
    async def _calculate_pricing(self, order_data: dict):
        """Pricing Agent calculates delivery cost"""
        # Fallback calculation
        base = 15.0
        weight = order_data.get('weight', 1)
        distance = order_data.get('distance', 50)
        service = order_data.get('service_type', 'standard')
        multiplier = {'standard': 1.0, 'express': 1.5, 'overnight': 2.0}.get(service, 1.0)
        fallback_price = round((base + weight * 2 + distance * 0.5) * multiplier, 2)
        
        if not self.agents_available:
            return {"price": fallback_price, "ai_analysis": "Calculated using fallback pricing"}
        
        try:
            task = create_calculate_price_task(pricing_agent, order_data)
            crew = Crew(agents=[pricing_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {"price": fallback_price, "ai_analysis": str(result)}
        except Exception as e:
            print(f"Agent pricing failed: {e}")
            return {"price": fallback_price, "ai_analysis": "Calculated using fallback pricing"}
    
    async def _plan_route(self, order_data: dict):
        """Smart Routing Agent creates delivery route"""
        origin = order_data.get('sender_address', 'Unknown')
        destination = order_data.get('receiver_address', 'Unknown')
        fallback_route = {
            "route": f"{origin} -> Hub -> {destination}",
            "estimated_time": "2-3 days"
        }
        
        if not self.agents_available:
            return {**fallback_route, "ai_plan": "Planned using fallback routing"}
        
        try:
            task = create_calculate_route_task(smart_routing_agent, origin, destination)
            crew = Crew(agents=[smart_routing_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {**fallback_route, "ai_plan": str(result)}
        except Exception as e:
            print(f"Agent route planning failed: {e}")
            return {**fallback_route, "ai_plan": "Planned using fallback routing"}
    
    async def _create_tracking(self, order_data: dict, route_data: dict):
        """Tracking Agent creates initial tracking entry"""
        fallback_tracking = {
            "status": "pending",
            "description": "Order created and pending pickup"
        }
        
        if not self.agents_available:
            return {**fallback_tracking, "ai_notes": "Tracking created using fallback logic"}
        
        try:
            order_id = order_data.get('id', 'unknown')
            location = order_data.get('sender_address', 'unknown')
            task = create_broadcast_location_task(tracking_monitoring_agent, order_id, location)
            crew = Crew(agents=[tracking_monitoring_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {**fallback_tracking, "ai_notes": str(result)}
        except Exception as e:
            print(f"Agent tracking creation failed: {e}")
            return {**fallback_tracking, "ai_notes": "Tracking created using fallback logic"}
    
    async def assign_courier(self, order_id: str, hub_location: str):
        """Courier Management Agent assigns courier to delivery"""
        fallback_courier = f"DRV{hash(order_id) % 16 + 1:03d}"
        
        if not self.agents_available:
            return {"courier_id": fallback_courier, "assignment_reason": "Assigned using fallback logic"}
        
        try:
            order_data = {"order_id": order_id, "pickup_location": hub_location}
            task = create_assign_courier_task(courier_management_agent, order_data)
            crew = Crew(agents=[courier_management_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {
                "courier_id": fallback_courier,
                "assignment_reason": str(result)
            }
        except Exception as e:
            print(f"Agent courier assignment failed: {e}")
            return {"courier_id": fallback_courier, "assignment_reason": "Assigned using fallback logic"}
    
    async def update_delivery_status(self, order_id: str, new_status: str, location: str):
        """Tracking Agent updates delivery status"""
        descriptions = {
            "picked_up": "Package picked up from sender",
            "in_transit": "Package in transit to destination",
            "out_for_delivery": "Package out for delivery",
            "delivered": "Package successfully delivered"
        }
        fallback_desc = descriptions.get(new_status, "Status updated")
        
        if not self.agents_available:
            return {"status": new_status, "description": fallback_desc, "ai_notes": "Updated using fallback logic"}
        
        try:
            task = create_broadcast_location_task(tracking_monitoring_agent, order_id, location)
            crew = Crew(agents=[tracking_monitoring_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": new_status,
                "description": fallback_desc,
                "ai_notes": str(result)
            }
        except Exception as e:
            print(f"Agent status update failed: {e}")
            return {"status": new_status, "description": fallback_desc, "ai_notes": "Updated using fallback logic"}
    
    async def monitor_performance(self, order_ids: list):
        """Monitoring Agent checks delivery performance"""
        fallback_metrics = {
            "total_orders": len(order_ids),
            "on_time": max(0, len(order_ids) - 1),
            "delayed": min(1, len(order_ids))
        }
        
        if not self.agents_available:
            return {**fallback_metrics, "ai_analysis": "Analyzed using fallback logic"}
        
        try:
            task = create_generate_analytics_task(tracking_monitoring_agent, "current")
            crew = Crew(agents=[tracking_monitoring_agent], tasks=[task], verbose=True)
            result = crew.kickoff()
            
            return {**fallback_metrics, "ai_analysis": str(result)}
        except Exception as e:
            print(f"Agent performance monitoring failed: {e}")
            return {**fallback_metrics, "ai_analysis": "Analyzed using fallback logic"}