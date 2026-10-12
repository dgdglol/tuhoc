import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV | Bùi Vũ Dũng",
  description: "Trang cá nhân của Bùi Vũ Dũng",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
