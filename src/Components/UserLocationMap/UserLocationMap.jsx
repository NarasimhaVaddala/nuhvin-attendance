import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const UserLocationMap = ({ location, error, isLocationLoaded }) => {
  return (
    <div>
      <h3>User Location Map</h3>
      {error ? (
        <p>Error: {error}</p>
      ) : isLocationLoaded ? (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location}>
            <Popup>You are here.</Popup>
          </Marker>
          <RecenterAutomatically lat={location.lat} lng={location.lng} />
        </MapContainer>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default UserLocationMap;
