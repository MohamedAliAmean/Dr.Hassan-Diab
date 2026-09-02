import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const bookingSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  scheduled_at: z.string(),
  type: z.enum(["assessment", "session", "consultation"]).default("assessment"),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const supabase = await createClient();

    const { data: lead } = await supabase
      .from("leads")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        status: "new",
      })
      .select("id")
      .single();

    const { error } = await supabase.from("bookings").insert({
      lead_id: lead?.id || null,
      type: data.type,
      scheduled_at: data.scheduled_at,
      duration_min: 15,
      status: "pending",
      notes: data.notes || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
