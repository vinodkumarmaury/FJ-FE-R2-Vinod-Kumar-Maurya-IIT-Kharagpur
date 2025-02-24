interface RideDetails {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  distance: number;
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

interface RideCardProps {
  ride: RideDetails;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {ride.pickup} → {ride.destination}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(ride.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ₹{ride.fare}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ride.distance} km
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <img
          src={ride.driver.photo}
          alt={ride.driver.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium dark:text-white">{ride.driver.name}</p>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {ride.driver.rating}
            </span>
          </div>
        </div>
      </div>

      {ride.isShared && ride.participants && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Shared Ride
          </p>
          {ride.participants.map((participant, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {participant.name}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                ₹{participant.contribution}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideCard;
