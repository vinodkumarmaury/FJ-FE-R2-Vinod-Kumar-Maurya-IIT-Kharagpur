interface RideDetails {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  fare: number;
  driver: {
    name: string;
    rating: number;
    photo: string;
  };
  isShared: boolean;
  participants?: {
    name: string;
    contribution: number;
  }[];
}

export default function RideCard({ ride }: { ride: RideDetails }) {
  return (
    <div className="border p-4 rounded mb-4 bg-gray-800 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p><strong>Pickup:</strong> {ride.pickup}</p>
          <p><strong>Destination:</strong> {ride.destination}</p>
          <p><strong>Date:</strong> {ride.date}</p>
          <p><strong>Fare:</strong> ${ride.fare}</p>
        </div>
        {ride.driver && (
          <div className="text-right">
            <p><strong>Driver:</strong> {ride.driver.name}</p>
            <p><strong>Rating:</strong> {ride.driver.rating}⭐</p>
          </div>
        )}
      </div>
      
      {ride.isShared && ride.participants && (
        <div className="mt-4 border-t pt-4">
          <p className="font-semibold">Shared Ride Details:</p>
          <div className="space-y-2">
            {ride.participants.map((participant, index) => (
              <p key={index}>
                {participant.name}: ${participant.contribution}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
