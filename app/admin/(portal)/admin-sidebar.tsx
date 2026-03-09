"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Events" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="border-b border-slate-700/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 font-bold text-white shadow-lg">
            CR
          </div>
          <div>
            <p className="text-sm font-bold text-white">COOP Radio</p>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${
                isActive ? "bg-white" : "bg-slate-600"
              }`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-700/50 p-4">
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
