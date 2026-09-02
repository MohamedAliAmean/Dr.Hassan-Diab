"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageEditorHeader } from "@/components/admin/PageEditorHeader";
import { slugify, formatPrice } from "@/lib/utils";
import type { Service } from "@/types/database";
import { Plus, Pencil } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  async function loadServices() {
    const supabase = createClient();
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data || []);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function startNew() {
    setEditing({
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "EGP",
      duration_weeks: 4,
      sessions_per_week: 3,
      features: [],
      is_active: true,
      sort_order: services.length,
    });
  }

  async function handleSave() {
    if (!editing?.name) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      features: typeof editing.features === "string"
        ? (editing.features as string).split("\n").filter(Boolean)
        : editing.features,
    };

    if (editing.id) {
      await supabase.from("services").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("services").insert(payload);
    }

    setEditing(null);
    setSaving(false);
    loadServices();
  }

  return (
    <div>
      <PageEditorHeader
        title="Services Page"
        publicPath="/services"
        description="Manage packages and prices shown on /services."
      />

      <div className="mb-4 flex justify-end">
        <Button onClick={startNew}>
          <Plus className="mr-1 h-4 w-4" /> Add Package
        </Button>
      </div>

      {editing && (
        <Card className="mt-6">
          <CardTitle>{editing.id ? "Edit Package" : "New Package"}</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Package name"
              value={editing.name || ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={editing.price || ""}
              onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Duration (weeks)"
              value={editing.duration_weeks || ""}
              onChange={(e) => setEditing({ ...editing, duration_weeks: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Sessions per week"
              value={editing.sessions_per_week || ""}
              onChange={(e) => setEditing({ ...editing, sessions_per_week: Number(e.target.value) })}
            />
            <div className="md:col-span-2">
              <Textarea
                placeholder="Description"
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Features (one per line)"
                value={Array.isArray(editing.features) ? editing.features.join("\n") : ""}
                onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n") })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_active ?? true}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{service.name}</CardTitle>
                <p className="mt-1 text-lg font-bold text-primary">
                  {service.price ? formatPrice(service.price, service.currency) : "—"}
                </p>
                <Badge className="mt-2" variant={service.is_active ? "success" : "warning"}>
                  {service.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <button onClick={() => setEditing(service)}>
                <Pencil className="h-4 w-4 text-muted" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
