import { getDictionary, getLocaleFromParam } from "@/lib/i18n";
import { BookForm } from "@/components/book/BookForm";

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  return <BookForm t={t} />;
}
