export interface Location {
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  pickupCoords: Location;
  destinationCoords: Location;
  distance: string;
  duration: string;
  fare: number;
  status: 'pending' | 'completed' | 'cancelled';
  rideType: 'economy' | 'premium';
  driver: {
    name: string;
    rating: number;
    photo: string;
    vehicleNumber: string;
    vehicleModel: string;
  };
  isShared: boolean;
  participants?: {
    name: string;
    contribution: number;
  }[];
}