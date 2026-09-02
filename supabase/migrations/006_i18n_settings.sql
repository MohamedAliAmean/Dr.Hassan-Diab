-- Arabic CMS fields for public Home / About pages.
-- Keys are optional; public pages fall back to English when empty.

insert into site_settings (key, value) values
  ('hero_title_ar', ''),
  ('hero_subtitle_ar', ''),
  ('tagline_ar', ''),
  ('trainer_name_ar', ''),
  ('about_title_ar', ''),
  ('about_body_ar', '')
on conflict (key) do nothing;
