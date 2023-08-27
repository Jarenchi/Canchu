import { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CanChu",
  description: "最棒的社群交友平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f9f9f9] dark:bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
