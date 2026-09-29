import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zone Data Admin",
  description: "Zone Data administration dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
