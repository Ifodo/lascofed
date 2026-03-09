import { CalendarDaysIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./components/site-header";
import HeroMotion from "./components/hero-motion";
import NewsletterForm from "./components/newsletter-form";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

const heroImages = [
  "/enhanced_radio_studio.jpg",
];

const fallbackEvents = [
  { title: "2021 LASCOFED Leaders Con", dateLabel: "24 October, 2021" },
  { title: "2022 LASCOFED Leaders Con", dateLabel: "15 November, 2022" },
  { title: "2023 Cooperative Leaders Con", dateLabel: "01 December, 2023" },
  { title: "2024 Cooperative Leaders Con", dateLabel: "28 February, 2024" },
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toLagosDate() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
}

function formatTimeValue(value: number) {
  return value.toString().padStart(2, "0");
}

type HomeContent = {
  nowPlaying: {
    title: string;
    host: string;
    time: string;
  } | null;
  schedule: Array<{
    id: string;
    dayLabel: string;
    title: string;
    time: string;
    isLive: boolean;
  }>;
  programs: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string | null;
  }>;
  news: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImageUrl: string | null;
  }>;
  events: Array<{
    id: string;
    title: string;
    dateLabel: string;
  }>;
};

async function getHomeContent(): Promise<HomeContent> {
  try {
    const lagosNow = toLagosDate();
    const dayOfWeek = lagosNow.getDay();
    const currentTime = `${formatTimeValue(lagosNow.getHours())}:${formatTimeValue(lagosNow.getMinutes())}`;

    const [featuredPrograms, latestNews, upcomingEvents, todaySlots] = await Promise.all([
      prisma.program.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      prisma.newsPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
      }),
      prisma.event.findMany({
        where: { status: { in: ["UPCOMING", "ONGOING"] } },
        orderBy: { startAt: "asc" },
        take: 4,
      }),
      prisma.scheduleSlot.findMany({
        where: { dayOfWeek },
        orderBy: { startTime: "asc" },
        include: {
          program: {
            select: {
              title: true,
              presenter: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          presenter: {
            select: {
              fullName: true,
            },
          },
        },
      }),
    ]);

    const liveSlot =
      todaySlots.find((slot: typeof todaySlots[0]) => slot.isLive) ??
      todaySlots.find((slot: typeof todaySlots[0]) => slot.startTime <= currentTime && slot.endTime > currentTime);

    const programsToUse = featuredPrograms.length
      ? featuredPrograms
      : await prisma.program.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { updatedAt: "desc" },
          take: 3,
        });

    return {
      nowPlaying: liveSlot
        ? {
            title: liveSlot.titleOverride || liveSlot.program?.title || "Live Program",
            host: liveSlot.presenter?.fullName || liveSlot.program?.presenter?.fullName || "LASCOFED Team",
            time: `${liveSlot.startTime} - ${liveSlot.endTime}`,
          }
        : null,
      schedule: todaySlots.slice(0, 6).map((slot: typeof todaySlots[0]) => ({
        id: slot.id,
        dayLabel: dayNames[slot.dayOfWeek] ?? "Today",
        title: slot.titleOverride || slot.program?.title || "Program TBA",
        time: `${slot.startTime} - ${slot.endTime}`,
        isLive: Boolean(slot.isLive),
      })),
      programs: programsToUse.map((program: typeof programsToUse[0]) => ({
        id: program.id,
        slug: program.slug,
        title: program.title,
        description: program.description,
        category: program.category,
      })),
      news: latestNews.map((post: typeof latestNews[0]) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || post.content.slice(0, 120),
        category: post.category || "News",
        coverImageUrl: post.coverImageUrl,
      })),
      events:
        upcomingEvents.length > 0
          ? upcomingEvents.map((event: typeof upcomingEvents[0]) => ({
              id: event.id,
              title: event.title,
              dateLabel: event.startAt.toLocaleDateString("en-NG", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
            }))
          : fallbackEvents.map((event: typeof fallbackEvents[0], index: number) => ({
              id: `fallback-${index}`,
              ...event,
            })),
    };
  } catch {
    return {
      nowPlaying: null,
      schedule: [],
      programs: [],
      news: [],
      events: fallbackEvents.map((event, index) => ({
        id: `fallback-${index}`,
        ...event,
      })),
    };
  }
}

export default async function Home() {
  const [settings, homeContent] = await Promise.all([getPublicSiteSettings(), getHomeContent()]);

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />

      <main>
        <section
          id="home"
          className="relative isolate overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-700 to-teal-700"
        >
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <HeroMotion images={heroImages} />

          <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-5 md:px-8 md:py-24 lg:py-28">
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs tracking-wide">
              COOP RADIO • Voice of Cooperative Development
            </p>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
              Lagos State Cooperative Federation (LASCOFED)
            </h1>            <p className="mt-3 text-xl font-semibold text-emerald-100 sm:text-2xl md:text-3xl">
              COOP Online Radio
            </p>            <p className="mt-4 max-w-2xl text-base text-emerald-50 md:mt-6 md:text-lg">
              Listen live, discover today&apos;s broadcast schedule, and stay informed with cooperative updates from COOP Radio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/livestream"
                className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
              >
                Listen Live
              </Link>
              <a
                href="#schedule"
                className="rounded-full border-2 border-red-300 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-600/20"
              >
                View Schedule
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:px-8">
          <article className="rounded-2xl border-2 border-emerald-100 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 md:p-7">
            <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest text-emerald-700">NOW PLAYING</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                  {homeContent.nowPlaying?.title ?? "No live show currently"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">Host: {homeContent.nowPlaying?.host ?? "LASCOFED Team"}</p>
                <p className="text-sm text-slate-600">Time: {homeContent.nowPlaying?.time ?? "Check today&apos;s schedule"}</p>
              </div>

              <div className="rounded-xl border-2 border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-4 shadow-md">
                <p className="text-xs font-semibold tracking-wide text-emerald-800">Quick Actions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/livestream"
                    className="inline-flex rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Open Live Player
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Browse Programs
                  </Link>
                </div>
                <p className="mt-3 text-xs text-slate-500">Studio line: {settings.callInPhone}</p>
              </div>
            </div>
          </article>
        </section>

        <section id="schedule" className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
            <p className="text-sm font-semibold tracking-widest text-emerald-700">TODAY SCHEDULE</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Current and Upcoming Shows</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homeContent.schedule.length > 0 ? (
                homeContent.schedule.map((slot) => (
                  <article key={slot.id} className={`rounded-2xl border-2 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    slot.isLive 
                      ? "border-red-300 bg-linear-to-br from-red-50 to-orange-50" 
                      : "border-slate-200 bg-white hover:border-emerald-200"
                  }`}>
                    <p className="text-xs font-semibold tracking-wide text-emerald-700">{slot.dayLabel}</p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{slot.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{slot.time}</p>
                    {slot.isLive ? (
                      <span className="mt-3 inline-flex rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        Live Now
                      </span>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500 md:col-span-2 lg:col-span-3">No schedule slots published yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-widest text-emerald-700">FEATURED PROGRAMS</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Programs on COOP Radio</h2>
            </div>
            <Link href="/programs" className="text-sm font-semibold text-red-700 hover:text-red-800">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {homeContent.programs.length > 0 ? (
              homeContent.programs.map((program) => (
                <article key={program.id} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs font-semibold tracking-wide text-emerald-700">{program.category || "Program"}</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{program.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{program.description.slice(0, 110)}...</p>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="mt-3 inline-flex rounded-full border-2 border-red-600 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                  >
                    View Details
                  </Link>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500 md:col-span-3">No published programs yet.</p>
            )}
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-widest text-emerald-700">LATEST NEWS</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">News & Announcements</h2>
              </div>
              <Link href="/news" className="text-sm font-semibold text-red-700 hover:text-red-800">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {homeContent.news.length > 0 ? (
                homeContent.news.map((post) => (
                  <article key={post.id} className="rounded-2xl border-2 border-slate-200 bg-white shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="flex flex-col sm:flex-row h-full">
                      {post.coverImageUrl && (
                        <div className="relative h-40 sm:h-auto sm:w-[30%] bg-slate-100 shrink-0">
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 640px) 100vw, 200px"
                          />
                        </div>
                      )}
                      <div className="flex flex-col p-5 sm:w-[70%]">
                        <p className="text-xs font-semibold tracking-wide text-emerald-700">{post.category}</p>
                        <h3 className="mt-2 text-base font-semibold text-slate-900">{post.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 flex-1">{post.excerpt}</p>
                        <Link
                          href={`/news/${post.slug}`}
                          className="mt-3 inline-flex self-start rounded-full border-2 border-red-600 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500 md:col-span-3">No published news yet.</p>
              )}
            </div>
          </div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-widest text-emerald-700">UPCOMING EVENTS</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Stay Connected with LASCOFED</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-red-700 hover:text-red-800">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {homeContent.events.map((event) => (
              <article key={event.id} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
                <p className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-emerald-700">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {event.dateLabel}
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{event.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-[#070b14] py-12 text-white md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Subscribe for Updates</h2>
              <p className="mt-3 max-w-lg text-white/85">
                Get cooperative news, program alerts, and announcements directly in your inbox.
              </p>
              <NewsletterForm />
            </div>
            <div className="space-y-2 text-sm text-white/85">
              <p className="font-semibold text-white">Contact Information</p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                {settings.callInPhone}
              </p>
              <p className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                contact@coopradiong.com
              </p>
              <p className="pt-2 text-white/75">
                Call in during live programs and engage with cooperative discussions and community updates.
              </p>
            </div>
            <div className="flex items-start justify-start md:col-span-2 lg:col-span-1 lg:justify-end">
              <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                <Image
                  src="/footer-assets/cooperative-federation-nigeria.png"
                  alt="Co-operative Federation of Nigeria"
                  width={180}
                  height={120}
                  className="h-auto w-32.5"
                />
                <Image
                  src="/footer-assets/international-cooperative-alliance.png"
                  alt="International Cooperative Alliance"
                  width={200}
                  height={100}
                  className="h-auto w-37.5"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
