import "./globals.css";

import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/provider/authProvider";
import QueryProvider from "@/provider/queryProvider";
import WorkerProvider from "@/provider/WorkerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Learning Platform - DiagnoTech-Ai",
  description: "",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body className={`${inter.className} w-full h-full`}>
      <AuthProvider>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <WorkerProvider>{children}</WorkerProvider>
          </ThemeProvider>
        </QueryProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
