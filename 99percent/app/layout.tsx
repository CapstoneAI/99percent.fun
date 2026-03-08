import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "99percent — Cook your token. On Base.",
  description: "99% pure tokens. Launch on Base in 30 seconds. Human vs AI Agent competition.",
  openGraph: {
    title: "99percent",
    description: "Cook your token. On Base.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
