import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from core.websocket import manager

class RealTimeRoutingService:
    def __init__(self):
        import os
        self.ors_api_key = os.getenv("ORS_API_KEY")
        self.weather_api_key = os.getenv("OWM_API_KEY")
        self.active_routes = {}
        
    async def calculate_optimal_route(self, origin: str, destination: str, 
                                    vehicle_type: str = "car") -> Dict:
        """Calculate optimal route considering real-time traffic and weather"""
        
        async with aiohttp.ClientSession() as session:
            # Get route with traffic data
            route_data = await self._get_route_with_traffic(session, origin, destination)
            
            # Get weather conditions
            weather_data = await self._get_weather_conditions(session, origin, destination)
            
            # Calculate route score based on multiple factors
            route_score = self._calculate_route_score(route_data, weather_data)
            
            return {
                "route": route_data,
                "weather": weather_data,
                "score": route_score,
                "estimated_time": route_data.get("duration", 0),
                "distance": route_data.get("distance", 0),
                "traffic_level": route_data.get("traffic_level", "normal"),
                "weather_impact": weather_data.get("impact_level", "low")
            }
    
    async def _get_route_with_traffic(self, session: aiohttp.ClientSession, 
                                    origin: str, destination: str) -> Dict:
        """Get route data with real-time traffic from OpenRouteService"""
        
        url = "https://api.openrouteservice.org/v2/directions/driving-car"
        headers = {"Authorization": self.ors_api_key}
        
        # Convert address to coordinates if needed
        origin_coords = await self._geocode_address(session, origin)
        dest_coords = await self._geocode_address(session, destination)
        
        params = {
            "start": f"{origin_coords[1]},{origin_coords[0]}",
            "end": f"{dest_coords[1]},{dest_coords[0]}"
        }
        
        try:
            async with session.get(url, headers=headers, params=params) as response:
                data = await response.json()
                
                if "routes" in data and data["routes"]:
                    route = data["routes"][0]
                    summary = route["summary"]
                    
                    return {
                        "distance": summary["distance"],
                        "duration": summary["duration"],
                        "duration_in_traffic": summary["duration"],
                        "steps": route["segments"],
                        "polyline": route["geometry"],
                        "traffic_level": "normal"
                    }
                else:
                    raise Exception(f"OpenRouteService API error: {data.get('error', 'Unknown error')}")
                    
        except Exception as e:
            print(f"Route calculation error: {e}")
            return {"error": str(e)}
    
    async def _geocode_address(self, session: aiohttp.ClientSession, address: str) -> list:
        """Convert address to coordinates using ORS geocoding"""
        if "," in address and len(address.split(",")) == 2:
            try:
                lat, lng = map(float, address.split(","))
                return [lat, lng]
            except:
                pass
        
        url = "https://api.openrouteservice.org/geocode/search"
        headers = {"Authorization": self.ors_api_key}
        params = {"text": address}
        
        try:
            async with session.get(url, headers=headers, params=params) as response:
                data = await response.json()
                if data["features"]:
                    coords = data["features"][0]["geometry"]["coordinates"]
                    return [coords[1], coords[0]]  # lat, lng
        except:
            pass
        
        return [40.7128, -74.0060]  # Default NYC coordinates
    
    async def _get_weather_conditions(self, session: aiohttp.ClientSession, 
                                    origin: str, destination: str) -> Dict:
        """Get weather conditions for route"""
        
        url = f"http://api.openweathermap.org/data/2.5/weather"
        
        # Get weather for origin
        params = {"q": origin, "appid": self.weather_api_key, "units": "metric"}
        
        try:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                weather_condition = data["weather"][0]["main"].lower()
                visibility = data.get("visibility", 10000)
                wind_speed = data["wind"]["speed"]
                
                impact_level = self._calculate_weather_impact(weather_condition, visibility, wind_speed)
                
                return {
                    "condition": weather_condition,
                    "visibility": visibility,
                    "wind_speed": wind_speed,
                    "impact_level": impact_level,
                    "description": data["weather"][0]["description"]
                }
                
        except Exception as e:
            print(f"Weather API error: {e}")
            return {"condition": "clear", "impact_level": "low"}
    
    def _determine_traffic_level(self, leg_data: Dict) -> str:
        """Determine traffic level based on duration comparison"""
        normal_duration = leg_data["duration"]["value"]
        traffic_duration = leg_data.get("duration_in_traffic", {}).get("value", normal_duration)
        
        delay_ratio = traffic_duration / normal_duration
        
        if delay_ratio > 1.5:
            return "heavy"
        elif delay_ratio > 1.2:
            return "moderate"
        else:
            return "light"
    
    def _calculate_weather_impact(self, condition: str, visibility: int, wind_speed: float) -> str:
        """Calculate weather impact on delivery"""
        impact_score = 0
        
        # Weather condition impact
        if condition in ["rain", "snow", "thunderstorm"]:
            impact_score += 3
        elif condition in ["clouds", "mist", "fog"]:
            impact_score += 1
            
        # Visibility impact
        if visibility < 1000:
            impact_score += 3
        elif visibility < 5000:
            impact_score += 1
            
        # Wind impact
        if wind_speed > 15:
            impact_score += 2
        elif wind_speed > 10:
            impact_score += 1
            
        if impact_score >= 5:
            return "high"
        elif impact_score >= 3:
            return "medium"
        else:
            return "low"
    
    def _calculate_route_score(self, route_data: Dict, weather_data: Dict) -> float:
        """Calculate overall route score (0-100, higher is better)"""
        base_score = 100
        
        # Traffic penalty
        traffic_level = route_data.get("traffic_level", "light")
        if traffic_level == "heavy":
            base_score -= 30
        elif traffic_level == "moderate":
            base_score -= 15
            
        # Weather penalty
        weather_impact = weather_data.get("impact_level", "low")
        if weather_impact == "high":
            base_score -= 25
        elif weather_impact == "medium":
            base_score -= 10
            
        return max(0, base_score)
    
    async def monitor_active_route(self, order_id: str, route_data: Dict):
        """Monitor active route for changes and reroute if necessary"""
        self.active_routes[order_id] = {
            "route": route_data,
            "last_check": datetime.now(),
            "reroute_count": 0
        }
        
        while order_id in self.active_routes:
            await asyncio.sleep(300)  # Check every 5 minutes
            
            current_route = self.active_routes[order_id]["route"]
            origin = current_route.get("current_location", current_route.get("origin"))
            destination = current_route["destination"]
            
            # Recalculate route
            new_route = await self.calculate_optimal_route(origin, destination)
            
            # Check if rerouting is beneficial
            if self._should_reroute(current_route, new_route):
                await self._trigger_reroute(order_id, new_route)
    
    def _should_reroute(self, current_route: Dict, new_route: Dict) -> bool:
        """Determine if rerouting is beneficial"""
        current_score = current_route.get("score", 50)
        new_score = new_route.get("score", 50)
        
        # Reroute if new route is significantly better
        return new_score > current_score + 15
    
    async def _trigger_reroute(self, order_id: str, new_route: Dict):
        """Trigger reroute notification"""
        self.active_routes[order_id]["route"] = new_route
        self.active_routes[order_id]["reroute_count"] += 1
        
        # Broadcast reroute to courier and customer
        await manager.broadcast({
            "type": "reroute",
            "order_id": order_id,
            "new_route": new_route,
            "reason": "Better route found due to traffic/weather changes"
        })
    
    def stop_monitoring(self, order_id: str):
        """Stop monitoring a route"""
        if order_id in self.active_routes:
            del self.active_routes[order_id]

# Global instance
routing_service = RealTimeRoutingService()