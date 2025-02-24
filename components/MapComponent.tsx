"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./MapComponent.css";
import { Location } from '@/types';

// Custom icon creation function
const createCustomIcon = (color: string) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface MapComponentProps {
  currentLocation?: Location;
  pickup?: Location;
  destination?: Location;
}

interface RouteInfo {
  distance: string;
  duration: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentLocation,
  pickup,
  destination,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Once the MapContainer mounts, set the map instance from the ref
  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(mapRef.current);
    }
  }, [mapRef, map]);

  // Default center (Lucknow) if no location is provided
  const defaultCenter: L.LatLngTuple = [26.8467, 80.9462];
  const initialCenter: L.LatLngTuple = pickup
    ? [pickup.lat, pickup.lng]
    : currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : defaultCenter;

  // Recenter the map if currentLocation changes and no booking is done
  useEffect(() => {
    if (map && currentLocation && !pickup && !destination) {
      map.setView([currentLocation.lat, currentLocation.lng], 13);
    }
  }, [currentLocation, map, pickup, destination]);

  // Draw route when both pickup and destination are provided
  useEffect(() => {
    if (map && pickup && destination) {
      // Clear existing routing control
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }

      const routingOptions = {
        waypoints: [
          L.latLng(pickup?.lat || 0, pickup?.lng || 0),
          L.latLng(destination?.lat || 0, destination?.lng || 0)
        ],
        routeWhileDragging: false,
        lineOptions: {
          styles: [
            { color: '#4F46E5', opacity: 0.8, weight: 6 },
            { color: '#ffffff', opacity: 0.3, weight: 8 }
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        }
      };

      const control = L.Routing.control({
        ...routingOptions,
        createMarker: function(i: number, waypoint: any) {
          return L.marker(waypoint.latLng, {
            icon: createCustomIcon(i === 0 ? 'green' : 'red')
          }).bindPopup(i === 0 ? 'Pickup Location' : 'Destination');
        }
      }).addTo(map);

      // Fit the map to show both markers
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      setRoutingControl(control);
    }
  }, [map, pickup, destination]);

  useEffect(() => {
    if (map) {
      if (pickup && destination) {
        // Show route
        const bounds = L.latLngBounds([
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (currentLocation) {
        // Show current location
        map.setView([currentLocation.lat, currentLocation.lng], 13);
      }
    }
  }, [map, currentLocation, pickup, destination]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
  };

  if (!isClient) {
    return (
      <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        ref={mapRef}
        className="rounded-lg shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {(!pickup && !destination) && (
          <Marker
            position={
              currentLocation
                ? [currentLocation.lat, currentLocation.lng]
                : defaultCenter
            }
            icon={createCustomIcon("blue")}
          >
            <Popup>
              {currentLocation
                ? "Your Current Location"
                : "Default Location: Lucknow"}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {routeInfo && (
        <div className="route-info absolute bottom-4 left-4 z-[400]">
          <h3 className="font-semibold text-lg mb-2">Route Information</h3>
          <p>
            <strong>Distance:</strong> {routeInfo.distance}
          </p>
          <p>
            <strong>Duration:</strong> {routeInfo.duration}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
