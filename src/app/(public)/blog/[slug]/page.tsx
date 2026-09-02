import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

interface Props {
  params: Promise<{ slug: string }>;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
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

      {post.video_url && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-black">
          <video
            src={post.video_url}
            controls
            playsInline
            className="aspect-video w-full"
          />
        </div>
      )}

      {!post.video_url && post.cover_image && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          {isVideoUrl(post.cover_image) ? (
            <video
              src={post.cover_image}
              controls
              playsInline
              className="aspect-video w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt={post.title}
              className="aspect-video w-full object-cover"
            />
          )}
        </div>
      )}

      {post.video_url && post.cover_image && !isVideoUrl(post.cover_image) && (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="prose mt-8 max-w-none">
        {post.content?.split("\n").map((paragraph: string, i: number) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
