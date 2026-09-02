import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(full_name), receiver:profiles!receiver_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="text-muted">Client messages and conversations.</p>

      <div className="mt-6 space-y-4">
        {messages?.map((msg) => {
          const sender = msg.sender as unknown as { full_name: string } | null;
          const receiver = msg.receiver as unknown as { full_name: string } | null;
          return (
            <div key={msg.id} className={`rounded-xl border p-4 ${!msg.is_read ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{sender?.full_name} → {receiver?.full_name}</span>
                <span className="text-muted">{format(new Date(msg.created_at), "MMM d, HH:mm")}</span>
              </div>
              <p className="mt-2">{msg.body}</p>
            </div>
          );
        })}
        {(!messages || messages.length === 0) && (
          <p className="py-12 text-center text-muted">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
