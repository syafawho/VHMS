import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the missing marker icons issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41], // Anchor at the bottom of the icon
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapProps {
  latitude: number;
  longitude: number;
}

// Component to trigger map resize
const MapAutoResize: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize(); // Trigger map resize
  }, [map]);

  return null;
};

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  return (
    <div style={{ height: "500px" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapAutoResize />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            Your location: <br />
            Latitude: {latitude}, Longitude: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
