export type UserRole = "admin" | "client" | "lead";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type FitnessGoal = "weight_loss" | "muscle_gain" | "performance" | "rehab";
export type LeadStatus = "new" | "contacted" | "converted" | "lost";
export type BookingType = "assessment" | "session" | "consultation";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core"
  | "full_body";
export type ProgramStatus = "active" | "completed" | "paused";
export type MediaType = "image" | "video" | "document";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  goals: string[] | null;
  experience_level: ExperienceLevel | null;
  injuries: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  currency: string;
  duration_weeks: number | null;
  sessions_per_week: number | null;
  features: string[];
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  goal: FitnessGoal | null;
  experience: ExperienceLevel | null;
  schedule: string | null;
  injuries: string | null;
  recommended_service_id: string | null;
  quiz_answers: Record<string, unknown>;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  lead_id: string | null;
  client_id: string | null;
  type: BookingType;
  scheduled_at: string;
  duration_min: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  muscle_group: MuscleGroup;
  difficulty: ExperienceLevel;
  equipment: string[];
  video_url: string | null;
  thumbnail_url: string | null;
  instructions: string[];
  common_mistakes: string[];
  tips: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Program {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProgramStatus;
  created_by: string | null;
  created_at: string;
}

export interface ProgramDay {
  id: string;
  program_id: string;
  day_number: number;
  day_name: string;
  notes: string | null;
  sort_order: number;
}

export interface ProgramExercise {
  id: string;
  program_day_id: string;
  exercise_id: string;
  sets: number | null;
  reps: string | null;
  rest_seconds: number | null;
  notes: string | null;
  sort_order: number;
}

export interface WorkoutLog {
  id: string;
  client_id: string;
  program_day_id: string | null;
  logged_at: string;
  duration_min: number | null;
  notes: string | null;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  client_id: string;
  recorded_at: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  notes: string | null;
  created_at: string;
}

export interface Transformation {
  id: string;
  client_name: string;
  slug: string;
  title: string;
  summary: string | null;
  goal: string | null;
  duration_weeks: number | null;
  service_id: string | null;
  before_image: string | null;
  after_image: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface TransformationMilestone {
  id: string;
  transformation_id: string;
  month_number: number;
  title: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  rules: string[];
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: MediaType;
  file_size: number | null;
  alt_text: string | null;
  folder: string | null;
  uploaded_at: string;
}

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile, Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }>;
      site_settings: TableDef<SiteSetting>;
      services: TableDef<Service, Omit<Service, "id" | "created_at"> & { id?: string; created_at?: string }>;
      leads: TableDef<Lead, Omit<Lead, "id" | "created_at" | "status" | "quiz_answers"> & { id?: string; created_at?: string; status?: LeadStatus; quiz_answers?: Record<string, unknown> }>;
      bookings: TableDef<Booking, Omit<Booking, "id" | "created_at" | "status" | "duration_min"> & { id?: string; created_at?: string; status?: BookingStatus; duration_min?: number }>;
      exercises: TableDef<Exercise, Omit<Exercise, "id" | "created_at"> & { id?: string; created_at?: string }>;
      programs: TableDef<Program, Omit<Program, "id" | "created_at" | "status"> & { id?: string; created_at?: string; status?: ProgramStatus }>;
      program_days: TableDef<ProgramDay, Omit<ProgramDay, "id"> & { id?: string }>;
      program_exercises: TableDef<ProgramExercise, Omit<ProgramExercise, "id"> & { id?: string }>;
      workout_logs: TableDef<WorkoutLog, Omit<WorkoutLog, "id" | "created_at" | "logged_at"> & { id?: string; created_at?: string; logged_at?: string }>;
      workout_log_sets: TableDef<{ id: string; workout_log_id: string; exercise_id: string; set_number: number; reps_done: number | null; weight_kg: number | null; notes: string | null }>;
      progress_entries: TableDef<ProgressEntry, Omit<ProgressEntry, "id" | "created_at"> & { id?: string; created_at?: string }>;
      personal_records: TableDef<{ id: string; client_id: string; exercise_id: string; weight_kg: number | null; reps: number | null; achieved_at: string; notes: string | null }>;
      transformations: TableDef<Transformation, Omit<Transformation, "id" | "created_at"> & { id?: string; created_at?: string }>;
      transformation_milestones: TableDef<TransformationMilestone, Omit<TransformationMilestone, "id"> & { id?: string }>;
      challenges: TableDef<Challenge, Omit<Challenge, "id" | "created_at"> & { id?: string; created_at?: string }>;
      challenge_participants: TableDef<{ id: string; challenge_id: string; client_id: string; score: number; joined_at: string }>;
      messages: TableDef<Message, Omit<Message, "id" | "created_at" | "is_read"> & { id?: string; created_at?: string; is_read?: boolean }>;
      blog_posts: TableDef<BlogPost, Omit<BlogPost, "id" | "created_at"> & { id?: string; created_at?: string }>;
      media: TableDef<Media, Omit<Media, "id" | "uploaded_at"> & { id?: string; uploaded_at?: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
