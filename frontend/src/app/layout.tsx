import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HPHE Designer",
  description: "Heat Pipe Heat Exchanger thermal calculation demo",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
