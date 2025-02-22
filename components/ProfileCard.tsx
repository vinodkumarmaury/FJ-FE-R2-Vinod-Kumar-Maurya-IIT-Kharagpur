interface Profile {
  name: string;
  email: string;
  totalRides: number;
}

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-bold">{profile.name}</h3>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Total Rides:</strong> {profile.totalRides || 0}
      </p>
    </div>
  );
}
