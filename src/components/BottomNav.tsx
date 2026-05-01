"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkCls =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-[#666666] transition-colors hover:text-black";

const activeCls = "text-black";

export function BottomNav() {
  const path = usePathname() ?? "";

  const is = (p: string) => path === p || path.startsWith(p + "/");

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
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-black ${is("/dashboard") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <HomeIcon />
          </span>
          Home
        </Link>
        <Link
          href="/type-say"
          className={`${linkCls} ${is("/type-say") ? activeCls : ""}`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-black ${is("/type-say") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <SearchIcon />
          </span>
          Type &amp; Say
        </Link>
        <Link
          href="/practice"
          className={`${linkCls} ${is("/practice") ? activeCls : ""}`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-black ${is("/practice") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <ChatIcon />
          </span>
          Practice
        </Link>
        <Link
          href="/profile"
          className={`${linkCls} ${is("/profile") ? activeCls : ""}`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-black ${is("/profile") ? "bg-black text-white" : "bg-white"}`}
            aria-hidden
          >
            <UserIcon />
          </span>
          Profile
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
