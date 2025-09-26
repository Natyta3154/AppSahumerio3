import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your profile page. Order history and personal data will be displayed here.</p>
          <p className="mt-4 text-sm text-muted-foreground">(This route should be protected and only accessible to logged-in users.)</p>
        </CardContent>
      </Card>
    </div>
  );
}
