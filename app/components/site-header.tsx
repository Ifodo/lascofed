"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LiveVideoPlayer from "./live-video-player";

const STREAM_URL = "https://azstream.elektranbroadcast.com/listen/lascofed/radio.mp3";

type SectionId = "home" | "services" | "directory" | "events" | "contact";

type NavItem = {
  href: string;
  label: string;
  sectionId?: SectionId;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", sectionId: "home" },
  { href: "/aboutus", label: "About Us" },
  { href: "/portfolio", label: "Our Portfolio" },
  { href: "/#services", label: "Our Services", sectionId: "services" },
  { href: "/#directory", label: "Directory", sectionId: "directory" },
  { href: "/#events", label: "Events", sectionId: "events" },
  { href: "/livestream", label: "Live Stream" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionIds: SectionId[] = ["home", "services", "directory", "events", "contact"];

    const updateActiveSection = () => {
      const topOffset = 160;
      let current: SectionId = "home";

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (!section) {
          continue;
        }

        const { top } = section.getBoundingClientRect();
        if (top <= topOffset) {
          current = sectionId;
        }
      }

      setActiveSection(current);
    };

    let frameId = 0;

    const syncInitialSection = () => {
      const hashSection = window.location.hash.replace("#", "") as SectionId;
      if (sectionIds.includes(hashSection)) {
        setActiveSection(hashSection);
      } else {
        updateActiveSection();
      }
    };

    frameId = window.requestAnimationFrame(syncInitialSection);

    const onHashChange = () => {
      const nextHashSection = window.location.hash.replace("#", "") as SectionId;
      if (sectionIds.includes(nextHashSection)) {
        setActiveSection(nextHashSection);
      } else {
        updateActiveSection();
      }
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 text-sm sm:px-5 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/coop_logo.png"
              alt="LASCOFED Logo"
              width={140}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <nav className="hidden gap-6 text-slate-600 md:flex">
            {navItems.map((item) => {
              const isActive = item.sectionId
                ? pathname === "/" && activeSection === item.sectionId
                : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (item.sectionId && pathname === "/") {
                      setActiveSection(item.sectionId);
                    }
                  }}
                  className={`relative pb-2 transition ${
                    isActive ? "text-slate-900" : "hover:text-red-700"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-[1px] h-0.5 w-full rounded-full bg-red-600 transition ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:inline-flex">
            <div className="w-36 overflow-hidden rounded-full border border-slate-900 bg-white lg:w-44">
              <audio controls preload="none" className="block h-8 w-full" src={STREAM_URL}>
                Your browser does not support the audio element.
              </audio>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveOpen(true)}
              className="inline-flex items-center rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 lg:px-4"
            >
              Watch Live
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 md:hidden">
          <div className="min-w-0 flex-1 overflow-hidden rounded-full border border-slate-900 bg-white">
            <audio controls preload="none" className="block h-8 w-full" src={STREAM_URL}>
              Your browser does not support the audio element.
            </audio>
          </div>
          <button
            type="button"
            onClick={() => setIsLiveOpen(true)}
            className="inline-flex shrink-0 items-center rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Watch Live
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="mt-3 border-t border-slate-200 pt-3 md:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => {
                const isActive = item.sectionId
                  ? pathname === "/" && activeSection === item.sectionId
                  : pathname === item.href;

                return (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    onClick={() => {
                      if (item.sectionId && pathname === "/") {
                        setActiveSection(item.sectionId);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-red-50 text-red-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {typeof document !== "undefined" &&
        isLiveOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-black p-4 text-white shadow-2xl md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">COOP Live Stream</h3>
                <button
                  type="button"
                  onClick={() => setIsLiveOpen(false)}
                  className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>
              <LiveVideoPlayer className="aspect-video w-full rounded-xl bg-black" />
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
