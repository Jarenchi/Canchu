"use client";

import { ThemeProvider } from "next-themes";
import StyledComponentsRegistry from "@/lib/registry";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </ThemeProvider>
  );
}
