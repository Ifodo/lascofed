import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SiteHeader from "../components/site-header";

export default async function NewsPage() {
  const [settings, posts] = await Promise.all([
    getPublicSiteSettings(),
    prisma.newsPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 100,
    }),
  ]);

  const typedPosts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    category: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
  }> = posts;

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <section className="rounded-3xl bg-linear-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold tracking-widest">NEWS & UPDATES</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">Latest Cooperative News</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
            Follow announcements, stories, and policy updates from LASCOFED and the cooperative movement.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {typedPosts.length > 0 ? (
            typedPosts.map((post: {
              id: string;
              slug: string;
              title: string;
              excerpt: string | null;
              content: string;
              category: string | null;
              coverImageUrl: string | null;
              publishedAt: Date | null;
            }) => (
              <article key={post.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row h-full">
                  {post.coverImageUrl && (
                    <div className="relative h-48 sm:h-auto sm:w-[30%] bg-slate-100 shrink-0">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 100vw, 250px"
                      />
                    </div>
                  )}
                  <div className="flex flex-col p-5 sm:w-[70%] md:p-6">
                    <p className="text-xs font-semibold tracking-wide text-emerald-700">{post.category || "News"}</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 flex-1">{(post.excerpt || post.content).slice(0, 150)}...</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        {post.publishedAt ? post.publishedAt.toLocaleDateString("en-NG") : "Draft date unavailable"}
                      </p>
                      <Link
                        href={`/news/${post.slug}`}
                        className="inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500 md:col-span-2 lg:col-span-3">No published news yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
