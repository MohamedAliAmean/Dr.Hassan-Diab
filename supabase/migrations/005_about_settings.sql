-- Extra About page settings
INSERT INTO site_settings (key, value) VALUES
  ('trainer_photo', ''),
  ('about_title', 'About Hassan'),
  ('about_body', 'I believe training should fit your life — not the other way around. With over 5 years of experience coaching clients from beginners to competitive athletes, I focus on building sustainable habits that last.

My approach combines evidence-based programming with personalized attention. Every client gets a custom plan based on their body, goals, schedule, and limitations.

No cookie-cutter programs. No extreme diets. Just smart training that delivers measurable results.')
ON CONFLICT (key) DO NOTHING;
