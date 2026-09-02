import Link from "next/link";
import { PUBLIC_NAV } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">Hassan Diab</h3>
            <p className="mt-2 text-sm text-white/70">
              Sustainable strength coaching. Real results, built around your life.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="mt-3 flex flex-col gap-2">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold">Get Started</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/start" className="text-sm text-white/70 hover:text-white">
                Find Your Training Path
              </Link>
              <Link href="/book" className="text-sm text-white/70 hover:text-white">
                Book Free Assessment
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} Hassan Diab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
