import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Training Tips & Blog",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Training Tips</h1>
        <p className="mt-4 text-muted">
          Insights on training, nutrition, and mindset from Hassan.
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
                {post.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="aspect-video w-full object-cover"
                  />
                ) : post.video_url ? (
                  <div className="flex aspect-video items-center justify-center bg-primary/10 text-sm text-muted">
                    Video post
                  </div>
                ) : null}
                <div className="p-6">
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                  {post.published_at && (
                    <p className="mt-4 text-xs text-muted">
                      {format(new Date(post.published_at), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>Blog posts coming soon.</p>
        </div>
      )}
    </div>
  );
}
