// GPS Tracking Service using browser geolocation and OpenRouteService
class GPSService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.isTracking = false;
    this.callbacks = [];
  }

  // Start GPS tracking
  startTracking(callback) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    this.callbacks.push(callback);
    this.isTracking = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          timestamp: new Date().toISOString()
        };

        // Notify all callbacks
        this.callbacks.forEach(cb => cb(this.currentPosition));
      },
      (error) => {
        console.error('GPS Error:', error);
        this.callbacks.forEach(cb => cb(null, error));
      },
      options
    );
  }

  // Stop GPS tracking
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.callbacks = [];
  }

  // Get current position once
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            timestamp: new Date().toISOString()
          });
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
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

  // Check if within geofence
  isWithinGeofence(targetLat, targetLng, radiusMeters = 100) {
    if (!this.currentPosition) return false;
    
    const distance = this.calculateDistance(
      this.currentPosition.lat, this.currentPosition.lng,
      targetLat, targetLng
    ) * 1000; // Convert to meters
    
    return distance <= radiusMeters;
  }
}

export default new GPSService();