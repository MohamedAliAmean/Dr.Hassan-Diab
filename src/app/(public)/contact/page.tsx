"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.key] = row.value || "";
      });
      setSettings({
        email: map.email || "",
        phone: map.phone || "",
        whatsapp: map.whatsapp || "",
        address: map.address || "",
      });
    }
    load();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Get In Touch</h1>
        <p className="mt-4 text-muted">Have questions? We&apos;d love to hear from you.</p>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted">
                {settings.email || "Add email in Admin → Settings"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Phone / WhatsApp</p>
              <p className="text-sm text-muted">
                {settings.whatsapp || settings.phone || "Add phone in Admin → Settings"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted">
                {settings.address || "Add address in Admin → Settings"}
              </p>
            </div>
          </div>
        </div>

        <Card>
          {sent ? (
            <p className="text-center font-medium text-primary">
              Message sent! We&apos;ll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Your name" required />
              <Input type="email" placeholder="Email" required />
              <Textarea placeholder="Your message" required />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
