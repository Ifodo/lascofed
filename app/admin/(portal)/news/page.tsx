import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugWithSuffix } from "@/lib/slugify";
import NewsForm from "./news-form";

const publishStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
type NewsStatus = (typeof publishStatuses)[number];

async function createNewsPost(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();

  if (!title || !content) {
    return;
  }

  await prisma.newsPost.create({
    data: {
      title,
      excerpt: excerpt || null,
      content,
      category: category || null,
      coverImageUrl: coverImageUrl || null,
      slug: slugWithSuffix(title),
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
}

async function updateNewsStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as NewsStatus;

  if (!id || !publishStatuses.includes(status)) {
    return;
  }

  await prisma.newsPost.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
}

async function deleteNewsPost(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await prisma.newsPost.delete({ where: { id } });

  revalidatePath("/admin/news");
  revalidatePath("/");
}

export default async function AdminNewsPage() {
  const posts: Array<{
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    category: string | null;
    status: NewsStatus;
  }> = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">NEWS</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Manage News & Updates</h1>
        <p className="mt-2 text-sm text-slate-600">Create announcements, press releases, and cooperative updates.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Create News Post</h2>
        <NewsForm onSubmit={createNewsPost} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Recent News Posts</h2>
        <div className="mt-3 space-y-3">
          {posts.map((post: {
            id: string;
            title: string;
            excerpt: string | null;
            content: string;
            category: string | null;
            status: NewsStatus;
          }) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{post.category || "General"} • {post.status}</p>
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt || post.content.slice(0, 140)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.status !== "PUBLISHED" ? (
                    <form action={updateNewsStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="PUBLISHED" />
                      <button className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                        Publish
                      </button>
                    </form>
                  ) : (
                    <form action={updateNewsStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="DRAFT" />
                      <button className="rounded-full border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50">
                        Draft
                      </button>
                    </form>
                  )}

                  <form action={deleteNewsPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="rounded-full border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
