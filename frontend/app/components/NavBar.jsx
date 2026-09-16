"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const publicLinks = [
  { label: "Hackathons", href: "/hackathons" },
  { label: "How It Works", href: "/#how-it-works" },
];

function dashboardHref(role) {
  if (role === "student") return "/student";
  if (role === "admin") return "/admin";
  return "/";
}

export default function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const linkClass = (href) => `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    href === "/hackathons" && pathname.startsWith("/hackathons")
      ? "bg-[#eff6ff] text-[#1d4ed8]"
      : "text-[#525252] hover:bg-[#f1f1ee] hover:text-[#171717]"
  }`;
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e5e0]/90 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link className="text-xl font-bold tracking-tight text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]" href="/" onClick={closeMenu}>Judgr</Link>
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => <Link className={linkClass(link.href)} href={link.href} key={link.href}>{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? <span className="h-9 w-24 animate-pulse rounded-md bg-[#f1f1ee]" aria-label="Loading account" /> : user ? (
            <>
              <Link className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-[#171717] hover:bg-[#f1f1ee]" href={dashboardHref(user.role)}>Dashboard</Link>
              <button className="inline-flex h-10 items-center justify-center rounded-md border border-[#e5e5e0] px-4 text-sm font-semibold text-[#525252] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-[#171717] hover:bg-[#f1f1ee]" href="/login">Login</Link>
              <Link className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" href="/register">Get Started</Link>
            </>
          )}
        </div>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#e5e5e0] text-[#171717] md:hidden" type="button" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
          <span aria-hidden="true" className="text-xl">{isMenuOpen ? "×" : "☰"}</span>
        </button>
      </nav>
      {isMenuOpen && (
        <div className="border-t border-[#e5e5e0] bg-white px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-2">
            {publicLinks.map((link) => <Link className={linkClass(link.href)} href={link.href} key={link.href} onClick={closeMenu}>{link.label}</Link>)}
            <div className="my-2 border-t border-[#e5e5e0]" />
            {!isLoading && (user ? <>
              <Link className={linkClass(dashboardHref(user.role))} href={dashboardHref(user.role)} onClick={closeMenu}>Dashboard</Link>
              <button className="rounded-md px-3 py-2 text-left text-sm font-medium text-[#525252] hover:bg-[#f1f1ee] hover:text-[#171717]" onClick={() => { closeMenu(); logout(); }}>Logout</button>
            </> : <>
              <Link className={linkClass("/login")} href="/login" onClick={closeMenu}>Login</Link>
              <Link className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white" href="/register" onClick={closeMenu}>Get Started</Link>
            </>)}
          </div>
        </div>
      )}
    </header>
  );
}
