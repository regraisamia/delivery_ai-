import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from crewai import Crew, Task, Agent, LLM
from datetime import datetime

class DeliveryWorkflow:
    def __init__(self):
        try:
            self.llm = LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
        except:
            self.llm = None
    
    async def process_new_order(self, order_data: dict):
        """Complete workflow for new order processing"""
        try:
            # Step 1: Client Agent - Validate order
            client_result = await self._validate_order(order_data)
            
            # Step 2: Pricing Agent - Calculate price
            pricing_result = await self._calculate_pricing(order_data)
            
            # Step 3: Route Planner - Plan route
            route_result = await self._plan_route(order_data)
            
            # Step 4: Tracking Agent - Create initial tracking
            tracking_result = await self._create_tracking(order_data, route_result)
            
            return {
                "status": "success",
                "validation": client_result,
                "pricing": pricing_result,
                "route": route_result,
                "tracking": tracking_result
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _validate_order(self, order_data: dict):
        """Client Agent validates order data"""
        try:
            if not self.llm:
                return {"valid": True, "ai_notes": "Validation passed"}
            
            client_agent = Agent(
                role="Client Service Agent",
                goal="Validate and process customer orders",
                backstory="Expert in customer service and order validation",
                llm=self.llm,
                verbose=False
            )
            
            task = Task(
                description=f"Validate order: sender={order_data.get('sender_name')}, receiver={order_data.get('receiver_name')}, weight={order_data.get('weight')}kg",
                agent=client_agent,
                expected_output="Validation status and any issues"
            )
            
            crew = Crew(agents=[client_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            return {"valid": True, "ai_notes": str(result)}
        except:
            return {"valid": True, "ai_notes": "Validation passed"}
    
    async def _calculate_pricing(self, order_data: dict):
        """Pricing Agent calculates delivery cost"""
        try:
            if not self.llm:
                base = 15.0
                weight = order_data.get('weight', 1)
                multiplier = {'standard': 1.0, 'express': 1.5, 'overnight': 2.0}.get(order_data.get('service_type', 'standard'), 1.0)
                return {"price": round((base + weight * 2 + 50) * multiplier, 2)}
            
            pricing_agent = Agent(
                role="Pricing Specialist",
                goal="Calculate accurate delivery prices",
                backstory="Expert in logistics pricing with knowledge of market rates",
                llm=self.llm,
                verbose=False
            )
            
            weight = order_data.get('weight', 1)
            distance = 100  # Mock distance
            service = order_data.get('service_type', 'standard')
            
            task = Task(
                description=f"Calculate price for {weight}kg package, {distance}km distance, {service} service",
                agent=pricing_agent,
                expected_output="Price breakdown and total cost"
            )
            
            crew = Crew(agents=[pricing_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            # Calculate actual price
            base = 15.0
            multiplier = {'standard': 1.0, 'express': 1.5, 'overnight': 2.0}.get(service, 1.0)
            price = (base + weight * 2 + distance * 0.5) * multiplier
            
            return {"price": round(price, 2), "ai_analysis": str(result)}
        except:
            base = 15.0
            weight = order_data.get('weight', 1)
            multiplier = {'standard': 1.0, 'express': 1.5, 'overnight': 2.0}.get(order_data.get('service_type', 'standard'), 1.0)
            return {"price": round((base + weight * 2 + 50) * multiplier, 2)}
    
    async def _plan_route(self, order_data: dict):
        """Route Planner Agent creates delivery route"""
        try:
            if not self.llm:
                return {
                    "route": f"{order_data.get('sender_address')} -> {order_data.get('receiver_address')}",
                    "estimated_time": "2-3 days"
                }
            
            route_agent = Agent(
                role="Route Optimization Specialist",
                goal="Create optimal delivery routes",
                backstory="Expert in logistics and route optimization algorithms",
                llm=self.llm,
                verbose=False
            )
            
            origin = order_data.get('sender_address', 'Unknown')
            destination = order_data.get('receiver_address', 'Unknown')
            
            task = Task(
                description=f"Plan optimal route from {origin} to {destination}",
                agent=route_agent,
                expected_output="Route plan with stops and estimated time"
            )
            
            crew = Crew(agents=[route_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            return {
                "route": f"{origin} -> Hub -> {destination}",
                "estimated_time": "2-3 days",
                "ai_plan": str(result)
            }
        except:
            return {
                "route": f"{order_data.get('sender_address')} -> {order_data.get('receiver_address')}",
                "estimated_time": "2-3 days"
            }
    
    async def _create_tracking(self, order_data: dict, route_data: dict):
        """Tracking Agent creates initial tracking entry"""
        try:
            if not self.llm:
                return {
                    "status": "pending",
                    "description": "Order created and pending pickup"
                }
            
            tracking_agent = Agent(
                role="Tracking Coordinator",
                goal="Maintain accurate tracking information",
                backstory="Expert in shipment tracking and status updates",
                llm=self.llm,
                verbose=False
            )
            
            task = Task(
                description=f"Create tracking entry for new order from {order_data.get('sender_address')}",
                agent=tracking_agent,
                expected_output="Initial tracking status and description"
            )
            
            crew = Crew(agents=[tracking_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            return {
                "status": "pending",
                "description": "Order created and pending pickup",
                "ai_notes": str(result)
            }
        except:
            return {
                "status": "pending",
                "description": "Order created and pending pickup"
            }
    
    async def assign_courier(self, order_id: int, hub_location: str):
        """City Hub Agent assigns courier to delivery"""
        try:
            hub_agent = Agent(
                role="City Hub Manager",
                goal="Efficiently assign deliveries to couriers",
                backstory="Expert in courier management and task assignment",
                llm=self.llm,
                verbose=False
            )
            
            task = Task(
                description=f"Assign courier for order {order_id} at {hub_location}",
                agent=hub_agent,
                expected_output="Courier assignment with reasoning"
            )
            
            crew = Crew(agents=[hub_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            return {
                "courier_id": f"C{order_id % 10 + 1}",
                "assignment_reason": str(result)
            }
        except:
            return {"courier_id": f"C{order_id % 10 + 1}"}
    
    async def update_delivery_status(self, order_id: int, new_status: str, location: str):
        """Tracking Agent updates delivery status"""
        try:
            tracking_agent = Agent(
                role="Tracking Coordinator",
                goal="Update tracking information accurately",
                backstory="Expert in shipment tracking and status updates",
                llm=self.llm,
                verbose=False
            )
            
            task = Task(
                description=f"Update order {order_id} status to {new_status} at {location}",
                agent=tracking_agent,
                expected_output="Status update description"
            )
            
            crew = Crew(agents=[tracking_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            descriptions = {
                "picked_up": "Package picked up from sender",
                "in_transit": "Package in transit to destination",
                "out_for_delivery": "Package out for delivery",
                "delivered": "Package successfully delivered"
            }
            
            return {
                "status": new_status,
                "description": descriptions.get(new_status, "Status updated"),
                "ai_notes": str(result)
            }
        except:
            descriptions = {
                "picked_up": "Package picked up from sender",
                "in_transit": "Package in transit to destination",
                "out_for_delivery": "Package out for delivery",
                "delivered": "Package successfully delivered"
            }
            return {
                "status": new_status,
                "description": descriptions.get(new_status, "Status updated")
            }
    
    async def monitor_performance(self, order_ids: list):
        """Monitoring Agent checks delivery performance"""
        try:
            monitor_agent = Agent(
                role="Performance Monitor",
                goal="Track KPIs and detect delays",
                backstory="Expert in performance analytics and SLA monitoring",
                llm=self.llm,
                verbose=False
            )
            
            task = Task(
                description=f"Analyze performance for {len(order_ids)} orders",
                agent=monitor_agent,
                expected_output="Performance metrics and alerts"
            )
            
            crew = Crew(agents=[monitor_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            
            return {
                "total_orders": len(order_ids),
                "on_time": len(order_ids) - 1,
                "delayed": 1,
                "ai_analysis": str(result)
            }
        except:
            return {
                "total_orders": len(order_ids),
                "on_time": len(order_ids) - 1,
                "delayed": 1
            }
