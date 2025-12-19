import requests
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
import math

class RealTimeRoutingService:
    def __init__(self):
        self.osrm_base = "https://router.project-osrm.org/route/v1"
        self.weather_cache = {}
        self.traffic_cache = {}
        
    async def calculate_optimized_route(self, driver_location: dict, waypoints: List[dict], 
                                      vehicle_type: str = "bike") -> dict:
        """Calculate optimized route considering real-time conditions"""
        
        # Get weather conditions for route area
        weather = await self.get_weather_conditions(driver_location)
        
        # Get traffic conditions (simulated based on time and weather)
        traffic = self.get_traffic_conditions(weather)
        
        # Calculate base route using OSRM
        route_data = await self.get_osrm_route(driver_location, waypoints, vehicle_type)
        
        # Apply real-time optimizations
        optimized_route = await self.apply_real_time_optimizations(
            route_data, weather, traffic, vehicle_type
        )
        
        return optimized_route
    
    async def get_osrm_route(self, start: dict, waypoints: List[dict], vehicle_type: str) -> dict:
        """Get route from OSRM API"""
        try:
            # Convert vehicle type to OSRM profile
            profile = self.get_osrm_profile(vehicle_type)
            
            # Build coordinates string
            coords = [f"{start['lng']},{start['lat']}"]
            for wp in waypoints:
                coords.append(f"{wp['lng']},{wp['lat']}")
            
            coordinates = ";".join(coords)
            
            # OSRM API call
            url = f"{self.osrm_base}/{profile}/{coordinates}"
            params = {
                "overview": "full",
                "geometries": "geojson",
                "steps": "true",
                "annotations": "true"
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("routes"):
                route = data["routes"][0]
                return {
                    "coordinates": route["geometry"]["coordinates"],
                    "distance": route["distance"],  # meters
                    "duration": route["duration"],  # seconds
                    "steps": self.parse_route_steps(route.get("legs", [])),
                    "raw_data": route
                }
            else:
                return await self.get_fallback_route(start, waypoints)
                
        except Exception as e:
            print(f"OSRM routing error: {e}")
            return await self.get_fallback_route(start, waypoints)
    
    def get_osrm_profile(self, vehicle_type: str) -> str:
        """Map vehicle type to OSRM routing profile"""
        profiles = {
            "bike": "cycling",
            "scooter": "cycling", 
            "car": "driving",
            "van": "driving",
            "truck": "driving"
        }
        return profiles.get(vehicle_type, "cycling")
    
    def parse_route_steps(self, legs: List[dict]) -> List[dict]:
        """Parse OSRM route steps into navigation instructions"""
        steps = []
        
        for leg in legs:
            for step in leg.get("steps", []):
                instruction = step.get("maneuver", {})
                
                steps.append({
                    "instruction": self.get_instruction_text(instruction),
                    "distance": step.get("distance", 0),
                    "duration": step.get("duration", 0),
                    "coordinates": step.get("geometry", {}).get("coordinates", []),
                    "type": instruction.get("type", "straight")
                })
        
        return steps
    
    def get_instruction_text(self, maneuver: dict) -> str:
        """Convert OSRM maneuver to readable instruction"""
        maneuver_type = maneuver.get("type", "straight")
        modifier = maneuver.get("modifier", "")
        
        instructions = {
            "depart": "Start your journey",
            "arrive": "You have arrived at your destination",
            "turn": f"Turn {modifier}" if modifier else "Turn",
            "continue": "Continue straight",
            "merge": "Merge",
            "on-ramp": "Take the ramp",
            "off-ramp": "Take the exit",
            "fork": f"Keep {modifier}" if modifier else "Keep going",
            "roundabout": "Enter the roundabout"
        }
        
        return instructions.get(maneuver_type, "Continue")
    
    async def get_weather_conditions(self, location: dict) -> dict:
        """Get current weather conditions"""
        cache_key = f"{location['lat']:.2f},{location['lng']:.2f}"
        
        if cache_key in self.weather_cache:
            cached = self.weather_cache[cache_key]
            if (datetime.now() - cached['timestamp']).seconds < 1800:  # 30 min cache
                return cached['data']
        
        try:
            url = f"https://api.open-meteo.com/v1/current"
            params = {
                "latitude": location['lat'],
                "longitude": location['lng'],
                "current": "temperature_2m,precipitation,weather_code,wind_speed_10m,visibility"
            }
            
            response = requests.get(url, params=params, timeout=5)
            data = response.json()
            
            current = data.get("current", {})
            weather = {
                "temperature": current.get("temperature_2m", 20),
                "precipitation": current.get("precipitation", 0),
                "weather_code": current.get("weather_code", 0),
                "wind_speed": current.get("wind_speed_10m", 0),
                "visibility": current.get("visibility", 10000),
                "condition": self.get_weather_condition(current.get("weather_code", 0)),
                "is_rainy": current.get("precipitation", 0) > 0.1,
                "is_foggy": current.get("visibility", 10000) < 1000,
                "is_windy": current.get("wind_speed_10m", 0) > 20
            }
            
            self.weather_cache[cache_key] = {
                "data": weather,
                "timestamp": datetime.now()
            }
            
            return weather
            
        except Exception as e:
            print(f"Weather API error: {e}")
            return {
                "temperature": 20,
                "condition": "clear",
                "is_rainy": False,
                "is_foggy": False,
                "is_windy": False
            }
    
    def get_weather_condition(self, code: int) -> str:
        """Convert weather code to condition"""
        if code in [61, 63, 65, 80, 81, 82]:
            return "rainy"
        elif code in [71, 73, 75, 85, 86]:
            return "snowy"
        elif code in [45, 48]:
            return "foggy"
        elif code in [95, 96, 99]:
            return "stormy"
        else:
            return "clear"
    
    def get_traffic_conditions(self, weather: dict) -> dict:
        """Simulate traffic conditions based on time and weather"""
        now = datetime.now()
        hour = now.hour
        
        # Base traffic based on time of day
        if 7 <= hour <= 9 or 17 <= hour <= 19:
            base_traffic = "heavy"
            delay_factor = 1.5
        elif 10 <= hour <= 16:
            base_traffic = "moderate"
            delay_factor = 1.2
        else:
            base_traffic = "light"
            delay_factor = 1.0
        
        # Weather impact on traffic
        if weather.get("is_rainy"):
            delay_factor *= 1.3
        if weather.get("is_foggy"):
            delay_factor *= 1.4
        if weather.get("is_windy"):
            delay_factor *= 1.1
        
        return {
            "condition": base_traffic,
            "delay_factor": delay_factor,
            "congestion_level": min(100, int(delay_factor * 50))
        }
    
    async def apply_real_time_optimizations(self, route_data: dict, weather: dict, 
                                          traffic: dict, vehicle_type: str) -> dict:
        """Apply real-time optimizations to route"""
        
        # Adjust duration based on conditions
        base_duration = route_data["duration"]
        adjusted_duration = base_duration * traffic["delay_factor"]
        
        # Vehicle-specific adjustments
        vehicle_adjustments = {
            "bike": {
                "rain_penalty": 1.4,
                "wind_penalty": 1.2,
                "traffic_benefit": 0.8  # Bikes can navigate traffic better
            },
            "scooter": {
                "rain_penalty": 1.3,
                "wind_penalty": 1.15,
                "traffic_benefit": 0.85
            },
            "car": {
                "rain_penalty": 1.1,
                "wind_penalty": 1.0,
                "traffic_benefit": 1.0
            },
            "van": {
                "rain_penalty": 1.15,
                "wind_penalty": 1.05,
                "traffic_benefit": 1.1
            }
        }
        
        adjustments = vehicle_adjustments.get(vehicle_type, vehicle_adjustments["bike"])
        
        if weather.get("is_rainy"):
            adjusted_duration *= adjustments["rain_penalty"]
        
        if weather.get("is_windy"):
            adjusted_duration *= adjustments["wind_penalty"]
        
        # Apply traffic benefit/penalty
        adjusted_duration *= adjustments["traffic_benefit"]
        
        # Calculate optimized speed
        distance_km = route_data["distance"] / 1000
        optimized_speed = (distance_km / (adjusted_duration / 3600)) if adjusted_duration > 0 else 0
        
        # Generate route warnings
        warnings = []
        if weather.get("is_rainy"):
            warnings.append("⚠️ Rain detected - Drive carefully, reduced visibility")
        if weather.get("is_foggy"):
            warnings.append("⚠️ Fog warning - Very low visibility")
        if traffic["condition"] == "heavy":
            warnings.append("🚦 Heavy traffic - Expect delays")
        
        return {
            "coordinates": route_data["coordinates"],
            "distance": route_data["distance"],
            "original_duration": base_duration,
            "optimized_duration": int(adjusted_duration),
            "steps": route_data["steps"],
            "weather": weather,
            "traffic": traffic,
            "warnings": warnings,
            "optimized_speed": round(optimized_speed, 1),
            "vehicle_type": vehicle_type,
            "eta": datetime.now().timestamp() + adjusted_duration,
            "route_quality": self.calculate_route_quality(weather, traffic),
            "alternative_suggested": self.should_suggest_alternative(weather, traffic, vehicle_type)
        }
    
    def calculate_route_quality(self, weather: dict, traffic: dict) -> str:
        """Calculate overall route quality"""
        score = 100
        
        if weather.get("is_rainy"):
            score -= 20
        if weather.get("is_foggy"):
            score -= 30
        if weather.get("is_windy"):
            score -= 10
        
        if traffic["condition"] == "heavy":
            score -= 25
        elif traffic["condition"] == "moderate":
            score -= 10
        
        if score >= 80:
            return "excellent"
        elif score >= 60:
            return "good"
        elif score >= 40:
            return "fair"
        else:
            return "poor"
    
    def should_suggest_alternative(self, weather: dict, traffic: dict, vehicle_type: str) -> bool:
        """Determine if alternative route should be suggested"""
        if weather.get("is_foggy") and vehicle_type in ["bike", "scooter"]:
            return True
        if weather.get("is_rainy") and traffic["condition"] == "heavy":
            return True
        return False
    
    async def get_fallback_route(self, start: dict, waypoints: List[dict]) -> dict:
        """Fallback route calculation using straight lines"""
        coordinates = [[start['lng'], start['lat']]]
        total_distance = 0
        
        current = start
        for wp in waypoints:
            coordinates.append([wp['lng'], wp['lat']])
            distance = self.calculate_distance(current['lat'], current['lng'], wp['lat'], wp['lng'])
            total_distance += distance
            current = wp
        
        return {
            "coordinates": coordinates,
            "distance": total_distance * 1000,  # Convert to meters
            "duration": total_distance * 120,   # Assume 30 km/h average
            "steps": [{"instruction": "Follow the route", "distance": total_distance * 1000}]
        }
    
    def calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance between coordinates in km"""
        R = 6371
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lng = math.radians(lng2 - lng1)
        
        a = (math.sin(delta_lat/2)**2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c