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
    titleKey: "overview" as const,
    items: [{ href: "/admin", itemKey: "dashboard" as const, icon: "LayoutDashboard" }],
  },
  {
    titleKey: "websitePages" as const,
    items: [
      { href: "/admin/pages", itemKey: "allPages" as const, icon: "LayoutGrid" },
      { href: "/admin/pages/home", itemKey: "home" as const, icon: "Home" },
      { href: "/admin/pages/about", itemKey: "about" as const, icon: "UserRound" },
      { href: "/admin/services", itemKey: "services" as const, icon: "Package" },
      { href: "/admin/transformations", itemKey: "results" as const, icon: "TrendingUp" },
      { href: "/admin/exercises", itemKey: "exercises" as const, icon: "Dumbbell" },
      { href: "/admin/blog", itemKey: "blog" as const, icon: "FileText" },
      { href: "/admin/challenges", itemKey: "challenges" as const, icon: "Trophy" },
      { href: "/admin/pages/contact", itemKey: "contact" as const, icon: "Phone" },
    ],
  },
  {
    titleKey: "business" as const,
    items: [
      { href: "/admin/leads", itemKey: "leads" as const, icon: "UserPlus" },
      { href: "/admin/bookings", itemKey: "bookings" as const, icon: "CalendarCheck" },
      { href: "/admin/clients", itemKey: "clients" as const, icon: "Users" },
      { href: "/admin/programs", itemKey: "programs" as const, icon: "Calendar" },
      { href: "/admin/messages", itemKey: "messages" as const, icon: "MessageSquare" },
    ],
  },
  {
    titleKey: "library" as const,
    items: [
      { href: "/admin/media", itemKey: "mediaLibrary" as const, icon: "Image" },
      { href: "/admin/settings", itemKey: "settings" as const, icon: "Settings" },
    ],
  },
] as const;

export const ADMIN_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "results",
  "exercises",
  "blog",
  "challenges",
  "contact",
] as const;

export const ADMIN_PAGES_MAP = [
  {
    pageKey: "home" as const,
    publicPath: "/",
    adminHref: "/admin/pages/home",
  },
  {
    pageKey: "about" as const,
    publicPath: "/about",
    adminHref: "/admin/pages/about",
  },
  {
    pageKey: "services" as const,
    publicPath: "/services",
    adminHref: "/admin/services",
  },
  {
    pageKey: "results" as const,
    publicPath: "/transformations",
    adminHref: "/admin/transformations",
  },
  {
    pageKey: "exercises" as const,
    publicPath: "/exercises",
    adminHref: "/admin/exercises",
  },
  {
    pageKey: "blog" as const,
    publicPath: "/blog",
    adminHref: "/admin/blog",
  },
  {
    pageKey: "challenges" as const,
    publicPath: "/challenges",
    adminHref: "/admin/challenges",
  },
  {
    pageKey: "contact" as const,
    publicPath: "/contact",
    adminHref: "/admin/pages/contact",
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
