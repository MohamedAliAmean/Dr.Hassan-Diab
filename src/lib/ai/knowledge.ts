import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";

/** Build a compact knowledge pack from admin-managed public content. */
export async function buildTrainingKnowledgeBase(): Promise<string> {
  const supabase = await createClient();
  const settings = await getSiteSettings();

  const [
    { data: posts },
    { data: services },
    { data: challenges },
    { data: exercises },
    { data: transformations },
  ] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("title, excerpt, content, category")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(20),
    supabase
      .from("services")
      .select("name, description, price, features, duration_weeks")
      .eq("is_active", true)
      .order("sort_order")
      .limit(20),
    supabase
      .from("challenges")
      .select("title, description, rules")
      .eq("is_active", true)
      .limit(10),
    supabase
      .from("exercises")
      .select("name, description, muscle_group, difficulty, tips")
      .eq("is_published", true)
      .order("name")
      .limit(40),
    supabase
      .from("transformations")
      .select("title, summary, goal, duration_weeks")
      .eq("is_published", true)
      .order("sort_order")
      .limit(15),
  ]);

  const sections: string[] = [];

  sections.push(`# Coach / Brand
Name: ${settings.trainer_name || settings.trainer_name_ar || "Hassan Diab"}
Tagline: ${settings.tagline || settings.tagline_ar || ""}
About: ${settings.about_body || settings.about_body_ar || ""}
Contact email: ${settings.email || "n/a"}
Phone: ${settings.phone || settings.whatsapp || "n/a"}
Address: ${settings.address || "n/a"}`);

  if (services?.length) {
    sections.push(
      `# Training packages\n` +
        services
          .map((s) => {
            const features = Array.isArray(s.features)
              ? s.features.join("; ")
              : "";
            return `- ${s.name} | price: ${s.price ?? "n/a"} | ${s.description || ""} | features: ${features}`;
          })
          .join("\n")
    );
  }

  if (posts?.length) {
    sections.push(
      `# Blog posts\n` +
        posts
          .map((p) => {
            const body = [p.excerpt, p.content].filter(Boolean).join("\n").slice(0, 1200);
            return `## ${p.title}${p.category ? ` (${p.category})` : ""}\n${body}`;
          })
          .join("\n\n")
    );
  }

  if (challenges?.length) {
    sections.push(
      `# Active challenges\n` +
        challenges
          .map((c) => {
            const rules = Array.isArray(c.rules) ? c.rules.join("; ") : "";
            return `- ${c.title}: ${c.description || ""} | rules: ${rules}`;
          })
          .join("\n")
    );
  }

  if (exercises?.length) {
    sections.push(
      `# Exercise library\n` +
        exercises
          .map(
            (e) =>
              `- ${e.name} (${e.muscle_group}/${e.difficulty}): ${e.description || ""} ${e.tips ? `| tip: ${e.tips}` : ""}`
          )
          .join("\n")
    );
  }

  if (transformations?.length) {
    sections.push(
      `# Client results\n` +
        transformations
          .map(
            (t) =>
              `- ${t.title}: ${t.summary || ""} | goal: ${t.goal || "n/a"} | weeks: ${t.duration_weeks ?? "n/a"}`
          )
          .join("\n")
    );
  }

  const packed = sections.join("\n\n").slice(0, 28000);
  return packed || "No published training content available yet.";
}

export function buildSystemPrompt(knowledge: string, locale: string) {
  const language =
    locale === "ar"
      ? "Answer in Arabic (Egyptian-friendly clear Arabic is fine)."
      : "Answer in English.";

  return `You are the official AI assistant for Hassan Diab personal training.

STRICT RULES:
1) Answer ONLY using the SITE KNOWLEDGE below (coach info, packages, blogs, exercises, challenges, results).
2) If the answer is not in the knowledge, say you don't have that info on the site and suggest contacting the coach / booking an assessment.
3) Stay in fitness, training, nutrition habits, mindset, and Hassan Diab services only.
4) Do NOT give medical diagnosis, prescribe medication, or dangerous advice. Suggest seeing a doctor for health/injury concerns.
5) Do NOT invent prices, guarantees, or credentials not present in the knowledge.
6) Keep answers concise and practical (short paragraphs or bullets).
7) ${language}

SITE KNOWLEDGE:
${knowledge}`;
}
