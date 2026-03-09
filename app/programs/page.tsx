import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SiteHeader from "../components/site-header";

export default async function ProgramsPage() {
  const [settings, programs] = await Promise.all([
    getPublicSiteSettings(),
    prisma.program.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      include: {
        presenter: {
          select: {
            fullName: true,
          },
        },
      },
      take: 100,
    }),
  ]);

  const typedPrograms: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string | null;
    isFeatured: boolean;
    presenter: { fullName: string } | null;
  }> = programs;

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <section className="rounded-3xl bg-linear-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold tracking-widest">PROGRAMS</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">On-Air Programs</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
            Explore all published programs on COOP Radio, including hosts and categories.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {typedPrograms.length > 0 ? (
            typedPrograms.map((program: {
              id: string;
              slug: string;
              title: string;
              description: string;
              category: string | null;
              isFeatured: boolean;
              presenter: { fullName: string } | null;
            }) => (
              <article key={program.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <p className="text-xs font-semibold tracking-widest text-emerald-700">
                  {program.category || "Program"}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{program.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{program.description.slice(0, 140)}...</p>
                <p className="mt-3 text-xs text-slate-500">
                  Host: {program.presenter?.fullName ?? "LASCOFED Team"}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {program.isFeatured && (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      Featured
                    </span>
                  )}
                  <Link
                    href={`/programs/${program.slug}`}
                    className="ml-auto rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500 md:col-span-2 lg:col-span-3">No published programs yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
