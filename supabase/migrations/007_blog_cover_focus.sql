-- Focal point for blog cover images (admin-controlled crop framing)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS cover_focus_x numeric NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS cover_focus_y numeric NOT NULL DEFAULT 50;

COMMENT ON COLUMN blog_posts.cover_focus_x IS 'Horizontal focal point percent 0-100 for object-position';
COMMENT ON COLUMN blog_posts.cover_focus_y IS 'Vertical focal point percent 0-100 for object-position';
