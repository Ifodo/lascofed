import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-auth-server";
import AdminSidebar from "./admin-sidebar";

type AdminPortalLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPortalLayout({ children }: AdminPortalLayoutProps) {
  const session = await requireAdminSession(["SUPER_ADMIN", "EDITOR"]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-8 py-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Control Center</p>
              <h1 className="mt-1.5 text-2xl font-bold text-slate-900">COOP Radio Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{session.fullName}</p>
                <p className="text-xs text-slate-500">{session.role}</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                View Website
              </Link>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
