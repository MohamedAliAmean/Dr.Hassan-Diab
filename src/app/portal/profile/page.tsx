"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import type { Profile } from "@/types/database";

export default function PortalProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        full_name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        injuries: profile.injuries,
      }).eq("id", user.id);
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card className="mt-6">
        <CardTitle>Personal Information</CardTitle>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <Input placeholder="Full name" value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          <Input type="tel" placeholder="Phone" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <Textarea placeholder="Bio" value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          <Textarea placeholder="Injuries / limitations" value={profile.injuries || ""} onChange={(e) => setProfile({ ...profile, injuries: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
        </form>
      </Card>
    </div>
  );
}
