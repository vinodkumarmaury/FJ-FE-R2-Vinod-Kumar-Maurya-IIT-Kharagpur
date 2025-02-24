"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./MapComponent.css";

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
}

declare module "leaflet" {
  namespace Routing {
    interface LineOptions {
      styles?: L.PathOptions[];
      extendToWaypoints: boolean;
      missingRouteTolerance: number;
      addToLayer?: boolean;
    }
    interface RoutingControlOptions {
      waypoints?: L.LatLng[] | { latLng: L.LatLng }[];
      routeWhileDragging?: boolean;
      lineOptions?: LineOptions;
      addWaypoints?: boolean;
      fitSelectedRoutes?: boolean | "smart";
      showAlternatives?: boolean;
      alternativeStyleOptions?: LineOptions;
      plan?: any;
      createMarker?(i: number, waypoint: any, n: number): L.Marker;
    }
  }
}

interface MapComponentProps {
  // For live tracking before booking:
  currentLocation?: {
    lat: number;
    lng: number;
  };
  // When a booking is done, these props are provided:
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

const MapComponent: React.FC<MapComponentProps> = ({
  currentLocation,
  pickup,
  destination,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default center if no location is provided
  const defaultCenter = { lat: 26.8467, lng: 80.9462 };
  const initialCenter = pickup
    ? [pickup.lat, pickup.lng]
    : currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [defaultCenter.lat, defaultCenter.lng];

  // Recenter the map if currentLocation changes and no booking is done
  useEffect(() => {
    if (map && currentLocation && !pickup && !destination) {
      map.setView([currentLocation.lat, currentLocation.lng], 13);
    }
  }, [currentLocation, map, pickup, destination]);

  // Draw route when both pickup and destination are provided
  useEffect(() => {
    if (map && pickup && destination) {
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }
      const routingOptions: L.Routing.RoutingControlOptions = {
        waypoints: [
          L.latLng(pickup.lat, pickup.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: true,
        lineOptions: {
          styles: [
            { color: "#4F46E5", opacity: 0.8, weight: 6 } as L.PathOptions,
            { color: "#ffffff", opacity: 0.3, weight: 8 } as L.PathOptions,
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
          addToLayer: true,
        },
        createMarker: function (i: number, waypoint: any) {
          const marker = L.marker(waypoint.latLng, {
            icon: createCustomIcon(i === 0 ? "green" : "red"),
          });
          marker.bindPopup(i === 0 ? "Pickup Location" : "Destination").openPopup();
          return marker;
        },
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: true,
        alternativeStyleOptions: {
          styles: [
            { color: "#9333EA", opacity: 0.5, weight: 4 },
            { color: "#2563EB", opacity: 0.4, weight: 4 },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
      };
      const control = L.Routing.control(routingOptions).addTo(map);
      setRoutingControl(control);

      control.on("routesfound", (e: any) => {
        const fastest = e.routes[0];
        setRouteInfo({
          distance: (fastest.summary.totalDistance / 1000).toFixed(2) + " km",
          duration: formatDuration(fastest.summary.totalTime),
        });
      });
    }
  }, [pickup, destination, map]);

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
        whenCreated={setMap}
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
                : [defaultCenter.lat, defaultCenter.lng]
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
