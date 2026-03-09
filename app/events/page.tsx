import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SiteHeader from "../components/site-header";

export default async function EventsPage() {
  const [settings, events] = await Promise.all([
    getPublicSiteSettings(),
    prisma.event.findMany({
      orderBy: { startAt: "asc" },
      take: 100,
    }),
  ]);

  const typedEvents: Array<{
    id: string;
    title: string;
    description: string | null;
    startAt: Date;
    location: string | null;
    status: string;
    registrationUrl: string | null;
  }> = events;

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <section className="rounded-3xl bg-linear-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold tracking-widest">EVENTS</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">Cooperative Events</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
            Track upcoming conferences, trainings, and community broadcasts.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {typedEvents.length > 0 ? (
            typedEvents.map((event: {
              id: string;
              title: string;
              description: string | null;
              startAt: Date;
              location: string | null;
              status: string;
              registrationUrl: string | null;
            }) => (
              <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <p className="text-xs font-semibold tracking-widest text-emerald-700">{event.status}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{event.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{event.description || "Details will be announced soon."}</p>
                <p className="mt-3 text-xs text-slate-500">{event.startAt.toLocaleString("en-NG")}</p>
                <p className="text-xs text-slate-500">{event.location || "Location TBA"}</p>
                {event.registrationUrl ? (
                  <Link
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Register
                  </Link>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500 md:col-span-2 lg:col-span-3">No events published yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
