"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  currentLocation?: {
    lat: number;
    lng: number;
  };
  pickup?: {
    lat: number;
    lng: number;
  };
  destination?: {
    lat: number;
    lng: number;
  };
}

interface RouteInfo {
  distance: string;
  duration: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ currentLocation, pickup, destination }) => {
  const [isClient, setIsClient] = useState(false);
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [pickupInput, setPickupInput] = useState<string>("");
  const [destinationInput, setDestinationInput] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          }
        } catch (error) {
          console.error("Error fetching route", error);
        }
      };

      fetchRoute();
    }
  }, [pickup, destination]);

  const center = currentLocation || pickup || { lat: 0, lng: 0 };

  if (!isClient) {
    return (
      <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div>
      {!pickup && !destination && (
        <>
          <input
            id="pickup"
            type="text"
            placeholder="Enter pickup location (e.g., 51.5074,-0.1278)"
            value={pickupInput}
            onChange={(e) => setPickupInput(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg shadow-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 transition"
          />

          <input
            id="destination"
            type="text"
            placeholder="Enter destination (e.g., 51.5074,-0.1278)"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg shadow-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 transition"
          />
        </>
      )}

      <MapContainer style={{ height: "400px", width: "100%" }} center={[center.lat, center.lng]} zoom={13}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} />
        )}
        {route.length > 0 && (
          <>
            <Marker position={route[0]} />
            <Marker position={route[route.length - 1]} />
            <Polyline positions={route} pathOptions={{ color: "blue" }} />
          </>
        )}
      </MapContainer>
      
      {routeInfo && (
        <div className="route-info mt-4 text-white">
          <p>Distance: {routeInfo.distance}</p>
          <p>Duration: {routeInfo.duration}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
