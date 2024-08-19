import React, { useEffect, useState } from "react";
import "./Home.css";
import UserLocationMap from "../UserLocationMap/UserLocationMap";
const Home = () => {
  const [location, setLocation] = useState({ lat: 17.385, lng: 78.4867 }); // Default to Hyderabad
  const [error, setError] = useState(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters

    // Convert degrees to radians
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters
    const distance = R * c;

    return distance;
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationLoaded(true);
          console.log(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Example usage:
    const distance = calculateDistance(
      17.4563197,
      78.3728344,
      17.4585475,
      78.368094
    );
    console.log(`Distance: ${distance} meters`);
  }, [location]);

  return (
    <div className="home-container">
      <UserLocationMap
        location={location}
        error={error}
        isLocationLoaded={isLocationLoaded}
      />
      <div className="home-all-button-cards">
        <button>Check-In</button>
        <button>Check-Out</button>
        <button>Refresh</button>
      </div>
    </div>
  );
};

export default Home;
