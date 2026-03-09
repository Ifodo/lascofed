import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SiteHeader from "../../components/site-header";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;

  const [settings, program] = await Promise.all([
    getPublicSiteSettings(),
    prisma.program.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        presenter: {
          select: {
            fullName: true,
            bio: true,
          },
        },
        schedules: {
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          take: 20,
        },
      },
    }),
  ]);

  if (!program) {
    notFound();
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <section className="rounded-3xl bg-linear-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold tracking-widest text-red-200">{program.category || "PROGRAM"}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">{program.title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-200 md:text-base">{program.description}</p>
          <Link
            href="/programs"
            className="mt-5 inline-flex rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Back to Programs
          </Link>
        </section>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-widest text-emerald-700">HOST</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{program.presenter?.fullName ?? "LASCOFED Team"}</p>
              {program.presenter?.bio ? <p className="mt-2 text-sm text-slate-600">{program.presenter.bio}</p> : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-widest text-emerald-700">SCHEDULE</p>
              {program.schedules.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {program.schedules.map((slot: {
                    id: string;
                    dayOfWeek: number;
                    startTime: string;
                    endTime: string;
                  }) => (
                    <li key={slot.id}>
                      {dayNames[slot.dayOfWeek] ?? "Day"}: {slot.startTime} - {slot.endTime}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Schedule will be updated soon.</p>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
