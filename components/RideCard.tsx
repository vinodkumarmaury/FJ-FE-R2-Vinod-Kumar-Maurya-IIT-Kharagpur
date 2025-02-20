export default function RideCard({ ride }: { ride: any }) {
    return (
      <div className="border p-4 rounded mb-4">
        <p><strong>Pickup:</strong> {ride.pickup}</p>
        <p><strong>Destination:</strong> {ride.destination}</p>
        <p><strong>Date:</strong> {ride.date}</p>
        <p><strong>Fare:</strong> ${ride.fare}</p>
      </div>
    );
  }
  