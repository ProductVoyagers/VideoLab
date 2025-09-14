import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-cinema-gray flex items-center justify-center">
        <p className="text-white">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-gray flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-cinema-gold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Role</p>
            <p className="text-lg capitalize">{user.user_metadata.role || "Buyer"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
