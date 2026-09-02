import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getDictionary, getLocaleFromParam, localizedPath } from "@/lib/i18n";

export const metadata: Metadata = { title: "Blog" };
export const revalidate = 60;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.blog.title}</h1>
        <p className="mt-4 text-muted">{t.blog.subtitle}</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={localizedPath(locale, `/blog/${post.slug || post.id}`)}
            >
              <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
                {post.cover_image ? (
                  <div className="relative aspect-video w-full">
                    <OptimizedImage
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      focusX={post.cover_focus_x}
                      focusY={post.cover_focus_y}
                    />
                  </div>
                ) : post.video_url ? (
                  <div className="flex aspect-video items-center justify-center bg-primary/10 text-sm text-muted">
                    {t.blog.videoPost}
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
          <p>{t.blog.empty}</p>
        </div>
      )}
    </div>
  );
}
