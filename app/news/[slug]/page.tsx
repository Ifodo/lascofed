import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SiteHeader from "../../components/site-header";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  const [settings, post] = await Promise.all([
    getPublicSiteSettings(),
    prisma.newsPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <section className="rounded-3xl bg-linear-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold tracking-widest text-red-200">{post.category || "NEWS"}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-200">
            {post.publishedAt ? post.publishedAt.toLocaleDateString("en-NG") : "Published date unavailable"}
          </p>
          <Link
            href="/news"
            className="mt-5 inline-flex rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Back to News
          </Link>
        </section>

        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {post.coverImageUrl && (
            <div className="relative h-80 w-full overflow-hidden rounded-t-2xl bg-slate-100 md:h-96">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            {post.excerpt ? <p className="text-sm font-medium leading-7 text-slate-700 md:text-base">{post.excerpt}</p> : null}
            <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700 md:text-base">{post.content}</div>
          </div>
        </article>
      </main>
    </div>
  );
}
