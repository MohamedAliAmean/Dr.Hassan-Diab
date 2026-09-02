-- Add video support for blog posts
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS video_url TEXT;
