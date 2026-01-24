import type { Metadata } from "next";
import "../styles/index.css";
import "../styles/tailwind.css";
import "../styles/theme.css";

export const metadata: Metadata = {
  title: "Rattanak Coffee Shop",
  description: "Premium coffee and accessories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
