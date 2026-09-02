import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hassan Diab | Personal Training Coach",
    template: "%s | Hassan Diab",
  },
  description:
    "Personal training coaching built around your body, schedule, and goals. Sustainable strength and real results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
