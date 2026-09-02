import { LocaleLink } from "@/components/i18n/LocaleLink";
import type { Dictionary } from "@/lib/i18n";

export function Footer({ t }: { t: Dictionary }) {
  const nav = [
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/transformations", label: t.nav.results },
    { href: "/exercises", label: t.nav.exercises },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{t.brand}</h3>
            <p className="mt-2 text-sm text-white/70">{t.footer.blurb}</p>
          </div>

          <div>
            <h4 className="font-semibold">{t.footer.quickLinks}</h4>
            <nav className="mt-3 flex flex-col gap-2">
              {nav.map((item) => (
                <LocaleLink
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </LocaleLink>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold">{t.footer.getStarted}</h4>
            <div className="mt-3 flex flex-col gap-2">
              <LocaleLink href="/start" className="text-sm text-white/70 hover:text-white">
                {t.footer.findPath}
              </LocaleLink>
              <LocaleLink href="/book" className="text-sm text-white/70 hover:text-white">
                {t.footer.book}
              </LocaleLink>
              <LocaleLink href="/contact" className="text-sm text-white/70 hover:text-white">
                {t.footer.contact}
              </LocaleLink>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {t.brand}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
