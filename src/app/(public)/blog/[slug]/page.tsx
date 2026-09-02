import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("title").eq("slug", slug).single();
  return { title: data?.title || "Blog Post" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      {post.published_at && (
        <time className="text-sm text-muted">
          {format(new Date(post.published_at), "MMMM d, yyyy")}
        </time>
      )}
      <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      {post.excerpt && <p className="mt-4 text-lg text-muted">{post.excerpt}</p>}

      <div className="prose mt-8 max-w-none">
        {post.content?.split("\n").map((paragraph: string, i: number) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
