import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './MapComponent.css';

interface MapComponentProps {
  currentLocation: {
    lat: number;
    lng: number;
  };
  pickup: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}

interface RouteInfo {
  distance: string;
  duration: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ currentLocation, pickup, destination }) => {
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  useEffect(() => {
    if (pickup && destination) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=your-api-key&start=${encodeURIComponent(pickup.lng)},${encodeURIComponent(pickup.lat)}&end=${encodeURIComponent(destination.lng)},${encodeURIComponent(destination.lat)}`
          );
          const data = await response.json();
          if (data && data.features && data.features.length > 0) {
            const coordinates = data.features[0].geometry.coordinates;
            const routeCoordinates = coordinates.map((point: any) => new L.LatLng(point[1], point[0]));
            setRoute(routeCoordinates);
            setRouteInfo({
              distance: (data.features[0].properties.segments[0].distance / 1000).toFixed(2) + ' km',
              duration: (data.features[0].properties.segments[0].duration / 60).toFixed(2) + ' mins',
            });
          } else {
            console.error("Error fetching route", data);
          }
        } catch (error) {
          console.error("Error fetching route", error);
        }
      };

      fetchRoute();
    }
  }, [pickup, destination]);

  return (
    <div>
      <MapContainer style={{ height: "400px", width: "100%" }} center={[0, 0]} zoom={10}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route.length > 0 && (
          <>
            <Marker position={route[0]} />
            <Marker position={route[route.length - 1]} />
            <Polyline positions={route} pathOptions={{ color: "blue" }} />
          </>
        )}
      </MapContainer>
      {routeInfo && (
        <div className="route-info">
          <p>Distance: {routeInfo.distance}</p>
          <p>Duration: {routeInfo.duration}</p>
        </div>
      )}
      <div>
        {currentLocation && (
          <>
            <p>Current Latitude: {currentLocation.lat}</p>
            <p>Current Longitude: {currentLocation.lng}</p>
          </>
        )}
        {pickup && (
          <>
            <p>Pickup Latitude: {pickup.lat}</p>
            <p>Pickup Longitude: {pickup.lng}</p>
          </>
        )}
        {destination && (
          <>
            <p>Destination Latitude: {destination.lat}</p>
            <p>Destination Longitude: {destination.lng}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
