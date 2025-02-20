interface Profile {
  name: string;
  email: string;
  totalRides: number;
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-bold">{profile.name}</h3>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Total Rides:</strong> {profile.totalRides || 0}</p>
    </div>
  );
}
