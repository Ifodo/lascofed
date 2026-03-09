import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  try {
    const [programs, scheduleSlots, newsPosts, events, subscribers] = await Promise.all([
      prisma.program.count(),
      prisma.scheduleSlot.count(),
      prisma.newsPost.count(),
      prisma.event.count(),
      prisma.subscriber.count(),
    ]);

    return { programs, scheduleSlots, newsPosts, events, subscribers, dbConnected: true };
  } catch {
    return {
      programs: 0,
      scheduleSlots: 0,
      newsPosts: 0,
      events: 0,
      subscribers: 0,
      dbConnected: false,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Monitor your broadcast operations and manage content at a glance.
        </p>
      </section>

      {!stats.dbConnected ? (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database is not connected yet. Set DATABASE_URL and run Prisma migrations to activate live stats.
        </div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-50 opacity-50" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">Programs</p>
          <p className="relative mt-2 text-3xl font-bold text-slate-900">{stats.programs}</p>
          <p className="relative mt-1 text-xs text-slate-600">Published & draft shows</p>
        </article>
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-50 opacity-50" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">Schedule Slots</p>
          <p className="relative mt-2 text-3xl font-bold text-slate-900">{stats.scheduleSlots}</p>
          <p className="relative mt-1 text-xs text-slate-600">Weekly allocations</p>
        </article>
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-50 opacity-50" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">News Posts</p>
          <p className="relative mt-2 text-3xl font-bold text-slate-900">{stats.newsPosts}</p>
          <p className="relative mt-1 text-xs text-slate-600">Editorial updates</p>
        </article>
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-amber-50 opacity-50" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">Events</p>
          <p className="relative mt-2 text-3xl font-bold text-slate-900">{stats.events}</p>
          <p className="relative mt-1 text-xs text-slate-600">Upcoming & completed</p>
        </article>
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-red-50 opacity-50" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">Subscribers</p>
          <p className="relative mt-2 text-3xl font-bold text-slate-900">{stats.subscribers}</p>
          <p className="relative mt-1 text-xs text-slate-600">Newsletter audience</p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-slate-600">Jump to common tasks</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/programs"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Program
          </Link>
          <Link
            href="/admin/schedule"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Update Schedule
          </Link>
          <Link
            href="/admin/news"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-white p-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Publish News
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Create Event
          </Link>
        </div>
      </section>
    </div>
  );
}
