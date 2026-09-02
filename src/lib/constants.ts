import type { ExperienceLevel, FitnessGoal } from "@/types/database";

export const FITNESS_GOALS: { value: FitnessGoal; label: string; description: string }[] = [
  { value: "weight_loss", label: "Weight Loss", description: "Burn fat and improve body composition" },
  { value: "muscle_gain", label: "Muscle Gain", description: "Build lean muscle and strength" },
  { value: "performance", label: "Athletic Performance", description: "Improve speed, power, and endurance" },
  { value: "rehab", label: "Rehab & Recovery", description: "Recover from injury and rebuild safely" },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "Beginner — Less than 6 months" },
  { value: "intermediate", label: "Intermediate — 6 months to 2 years" },
  { value: "advanced", label: "Advanced — 2+ years consistent training" },
];

export const SCHEDULE_OPTIONS = [
  "2 days per week",
  "3 days per week",
  "4 days per week",
  "5+ days per week",
];

export const MUSCLE_GROUPS = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "core", label: "Core" },
  { value: "full_body", label: "Full Body" },
] as const;

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  exercises: "exercises",
  transformations: "transformations",
  blog: "blog",
  challenges: "challenges",
  services: "services",
  general: "general",
} as const;

export const ADMIN_NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "Website Pages",
    items: [
      { href: "/admin/pages", label: "All Pages", icon: "LayoutGrid" },
      { href: "/admin/pages/home", label: "Home", icon: "Home" },
      { href: "/admin/pages/about", label: "About", icon: "UserRound" },
      { href: "/admin/services", label: "Services", icon: "Package" },
      { href: "/admin/transformations", label: "Results", icon: "TrendingUp" },
      { href: "/admin/exercises", label: "Exercises", icon: "Dumbbell" },
      { href: "/admin/blog", label: "Blog", icon: "FileText" },
      { href: "/admin/challenges", label: "Challenges", icon: "Trophy" },
      { href: "/admin/pages/contact", label: "Contact", icon: "Phone" },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/leads", label: "Leads", icon: "UserPlus" },
      { href: "/admin/bookings", label: "Bookings", icon: "CalendarCheck" },
      { href: "/admin/clients", label: "Clients", icon: "Users" },
      { href: "/admin/programs", label: "Programs", icon: "Calendar" },
      { href: "/admin/messages", label: "Messages", icon: "MessageSquare" },
    ],
  },
  {
    title: "Library",
    items: [
      { href: "/admin/media", label: "Media Library", icon: "Image" },
      { href: "/admin/settings", label: "General Settings", icon: "Settings" },
    ],
  },
] as const;

export const ADMIN_PAGES_MAP = [
  {
    title: "Home",
    path: "/",
    adminHref: "/admin/pages/home",
    description: "Hero title, subtitle, and homepage background image",
    media: "Hero image",
  },
  {
    title: "About",
    path: "/about",
    adminHref: "/admin/pages/about",
    description: "Trainer story, tagline, and profile photo",
    media: "Trainer photo",
  },
  {
    title: "Services",
    path: "/services",
    adminHref: "/admin/services",
    description: "Packages, prices, and features",
    media: "Optional package images",
  },
  {
    title: "Results",
    path: "/transformations",
    adminHref: "/admin/transformations",
    description: "Before/after stories and timelines",
    media: "Before & after photos",
  },
  {
    title: "Exercises",
    path: "/exercises",
    adminHref: "/admin/exercises",
    description: "Exercise library with demos",
    media: "Exercise videos & thumbnails",
  },
  {
    title: "Blog",
    path: "/blog",
    adminHref: "/admin/blog",
    description: "Articles, tips, cover images and videos",
    media: "Cover image + featured video per post",
  },
  {
    title: "Challenges",
    path: "/challenges",
    adminHref: "/admin/challenges",
    description: "Monthly challenges",
    media: "Challenge image",
  },
  {
    title: "Contact",
    path: "/contact",
    adminHref: "/admin/pages/contact",
    description: "Email, phone, WhatsApp, and address",
    media: "—",
  },
] as const;

export const PORTAL_NAV = [
  { href: "/portal", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portal/program", label: "My Program", icon: "Calendar" },
  { href: "/portal/log", label: "Log Workout", icon: "PlusCircle" },
  { href: "/portal/progress", label: "Progress", icon: "TrendingUp" },
  { href: "/portal/messages", label: "Messages", icon: "MessageSquare" },
  { href: "/portal/profile", label: "Profile", icon: "User" },
] as const;

export const PUBLIC_NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/transformations", label: "Results" },
  { href: "/exercises", label: "Exercises" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;
