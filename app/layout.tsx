import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Louvor Videira Camboriu",
  description: "Organização de grupos de louvor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body
        className="bg-[#f8f9fa] text-[#0f0f0f] antialiased flex min-h-screen"
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
