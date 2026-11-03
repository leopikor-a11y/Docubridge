import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocuBridge — Documents, made simpler",
  description: "Document preparation and practical digital tools in one place."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
