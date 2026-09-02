import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { OptimizedVideo } from "@/components/ui/OptimizedVideo";
import { decodeParam } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

async function findPost(rawSlug: string) {
  const slug = decodeParam(rawSlug);
  const supabase = await createClient();

  const candidates = Array.from(new Set([slug, rawSlug].filter(Boolean)));

  for (const candidate of candidates) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", candidate)
      .eq("is_published", true)
      .maybeSingle();
    if (data) return data;
  }

  for (const candidate of candidates) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", candidate)
      .eq("is_published", true)
      .maybeSingle();
    if (data) return data;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  return { title: post?.title || "Blog Post" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await findPost(slug);

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
          <OptimizedVideo
            src={post.video_url}
            poster={!isVideoUrl(post.cover_image || "") ? post.cover_image || undefined : undefined}
            className="aspect-video w-full"
          />
        </div>
      )}

      {!post.video_url && post.cover_image && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl border border-border">
          {isVideoUrl(post.cover_image) ? (
            <OptimizedVideo src={post.cover_image} className="h-full w-full" />
          ) : (
            <OptimizedImage
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
              focusX={post.cover_focus_x}
              focusY={post.cover_focus_y}
            />
          )}
        </div>
      )}

      {post.video_url && post.cover_image && !isVideoUrl(post.cover_image) && (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-border">
          <OptimizedImage
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            focusX={post.cover_focus_x}
            focusY={post.cover_focus_y}
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
