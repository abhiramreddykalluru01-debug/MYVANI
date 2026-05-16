"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const linkCls =
  "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium text-[#666666] transition-colors hover:text-black min-w-0";

const activeCls = "text-black";

export function BottomNav() {
  const path = usePathname() ?? "";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const is = (p: string) =>
    mounted && (path === p || path.startsWith(p + "/"));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-black bg-[#F5F5F5] pb-[env(safe-area-inset-bottom)]"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg">
        <Link
          href="/dashboard"
          className={`${linkCls} ${is("/dashboard") ? activeCls : ""}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black ${is("/dashboard") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <HomeIcon />
          </span>
          <span className="max-w-[4.5rem] truncate text-center leading-tight">Home</span>
        </Link>
        <Link
          href="/type-say"
          className={`${linkCls} ${is("/type-say") ? activeCls : ""}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black ${is("/type-say") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <SearchIcon />
          </span>
          <span className="max-w-[4.5rem] truncate text-center leading-tight">
            Type &amp; Say
          </span>
        </Link>
        <Link
          href="/situation"
          className={`${linkCls} ${is("/situation") ? activeCls : ""}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black ${is("/situation") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <SituationIcon />
          </span>
          <span className="max-w-[4.5rem] truncate text-center leading-tight">
            Situation
          </span>
        </Link>
        <Link
          href="/practice"
          className={`${linkCls} ${is("/practice") ? activeCls : ""}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black ${is("/practice") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <ChatIcon />
          </span>
          <span className="max-w-[4.5rem] truncate text-center leading-tight">
            Practice
          </span>
        </Link>
        <Link
          href="/profile"
          className={`${linkCls} ${is("/profile") ? activeCls : ""}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black ${is("/profile") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <UserIcon />
          </span>
          <span className="max-w-[4.5rem] truncate text-center leading-tight">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v12H5.17L4 17.17V4zm2 2v7.17L6.83 12H18V6H6z" />
    </svg>
  );
}

/** Map pin — situation / place */
function SituationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  );
}
