import { getDictionary, getLocaleFromParam } from "@/lib/i18n";
import { ContactForm } from "@/components/contact/ContactForm";
import { createClient } from "@/lib/supabase/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);

  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const map: Record<string, string> = {};
  data?.forEach((row) => {
    map[row.key] = row.value || "";
  });

  return (
    <ContactForm
      locale={locale}
      t={t}
      settings={{
        email: map.email || "",
        phone: map.phone || "",
        whatsapp: map.whatsapp || "",
        address: map.address || "",
      }}
    />
  );
}
