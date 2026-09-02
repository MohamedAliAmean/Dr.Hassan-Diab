import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const leadSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  goal: z.enum(["weight_loss", "muscle_gain", "performance", "rehab"]).optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  schedule: z.string().optional(),
  injuries: z.string().optional(),
  quiz_answers: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);

    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      goal: data.goal || null,
      experience: data.experience || null,
      schedule: data.schedule || null,
      injuries: data.injuries || null,
      quiz_answers: data.quiz_answers || {},
      status: "new",
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
