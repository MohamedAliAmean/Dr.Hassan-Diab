import { Card } from "@/components/ui/Card";

export default function PortalMessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="text-muted">Chat with Hassan about your training.</p>

      <Card className="mt-6 text-center">
        <p className="text-muted">
          Messaging will be available once Hassan sets up your account. Check back soon!
        </p>
      </Card>
    </div>
  );
}
