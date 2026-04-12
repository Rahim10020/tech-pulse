"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

function isAuthPath(pathname) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEditorMode =
    pathname === "/create" &&
    (searchParams.get("editor") === "1" ||
      searchParams.get("mode") === "editor");
  const shouldRenderHeader = !isAuthPath(pathname) && !isEditorMode;

  return (
    <>
      {shouldRenderHeader && <Header />}
      {children}
    </>
  );
}
