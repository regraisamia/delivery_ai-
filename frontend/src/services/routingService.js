// Free routing service using OpenRouteService
class RoutingService {
  constructor() {
    // Using public ORS instance (free, no API key needed)
    this.baseUrl = 'https://api.openrouteservice.org/v2';
    // For demo purposes, we'll use a fallback to avoid CORS issues
    this.fallbackUrl = 'https://router.project-osrm.org/route/v1';
  }

  // Get route between two points using OSRM (free, no API key)
  async getRoute(startLat, startLng, endLat, endLng) {
    try {
      const url = `${this.fallbackUrl}/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          coordinates: route.geometry.coordinates,
          distance: route.distance / 1000, // Convert to km
          duration: route.duration / 60, // Convert to minutes
          steps: this.generateSimpleSteps(route.geometry.coordinates)
        };
      }
      
      throw new Error('No route found');
    } catch (error) {
      console.warn('Routing service failed, using fallback:', error);
      return this.getFallbackRoute(startLat, startLng, endLat, endLng);
    }
  }

  // Fallback to straight line if routing fails
  getFallbackRoute(startLat, startLng, endLat, endLng) {
    const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
    return {
      coordinates: [[startLng, startLat], [endLng, endLat]],
      distance: distance,
      duration: distance * 2, // Estimate 2 minutes per km
      steps: [
        { instruction: 'Head towards destination', distance: distance * 1000 }
      ]
    };
  }

  // Generate simple navigation steps
  generateSimpleSteps(coordinates) {
    if (coordinates.length < 2) return [];
    
    const steps = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lng1, lat1] = coordinates[i];
      const [lng2, lat2] = coordinates[i + 1];
      const distance = this.calculateDistance(lat1, lng1, lat2, lng2) * 1000;
      
      steps.push({
        instruction: i === 0 ? 'Start journey' : 'Continue straight',
        distance: distance,
        coordinates: [lng1, lat1]
      });
    }
    
    steps.push({
      instruction: 'Arrive at destination',
      distance: 0,
      coordinates: coordinates[coordinates.length - 1]
    });
    
    return steps;
  }

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI/180);
  }

  // Get ETA based on current position and route
  calculateETA(currentLat, currentLng, destinationLat, destinationLng, averageSpeed = 30) {
    const distance = this.calculateDistance(currentLat, currentLng, destinationLat, destinationLng);
    const timeHours = distance / averageSpeed;
    const timeMinutes = timeHours * 60;
    
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + timeMinutes);
    
    return {
      eta: eta.toISOString(),
      remainingDistance: distance,
      remainingTime: timeMinutes
    };
  }
}

export default new RoutingService();