interface Profile {
  name: string;
  email: string;
  username: string;
  totalRides: number;
  phoneNumber: string;
  address: string;
}

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-white">
      <h3 className="text-2xl font-bold mb-4">{profile.name}</h3>
      <div className="space-y-2">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>Total Rides:</strong> {profile.totalRides}</p>
      </div>
    </div>
  );
}
