interface MapProps {
    pickup?: string;
    destination?: string;
    currentLocation?: { lat: number; lng: number };
    tracking?: boolean;
  }
  
  export default function MapComponent({ pickup, destination, currentLocation, tracking }: MapProps) {
    return (
      <div className="border p-4 rounded h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        {tracking && currentLocation ? (
          <div>
            <p className="mb-2">Tracking your ride...</p>
            <p>Lat: {currentLocation.lat.toFixed(4)}</p>
            <p>Lng: {currentLocation.lng.toFixed(4)}</p>
          </div>
        ) : (
          <div>
            <p className="mb-2">Map Placeholder</p>
            {pickup && destination ? (
              <p>
                Route: {pickup} to {destination}
              </p>
            ) : (
              <p>Enter pickup and destination to see route.</p>
            )}
          </div>
        )}
      </div>
    );
  }
  