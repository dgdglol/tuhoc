import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import "../(main)/loading"
export const metadata: Metadata = {
  title: "CV | Bùi Vũ Dũng",
  description: "Trang cá nhân của Bùi Vũ Dũng",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
