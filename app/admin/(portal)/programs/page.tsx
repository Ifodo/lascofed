import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugWithSuffix } from "@/lib/slugify";
import ProgramForm from "./program-form";

const publishStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
type ProgramStatus = (typeof publishStatuses)[number];

async function createProgram(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!title || !description) {
    return;
  }

  await prisma.program.create({
    data: {
      title,
      description,
      category: category || null,
      coverImageUrl: coverImageUrl || null,
      isFeatured,
      slug: slugWithSuffix(title),
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/programs");
  revalidatePath("/");
}

async function updateProgramStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as ProgramStatus;
  const isFeatured = formData.get("isFeatured") === "true";

  if (!id || !publishStatuses.includes(status)) {
    return;
  }

  await prisma.program.update({
    where: { id },
    data: { status, isFeatured },
  });

  revalidatePath("/admin/programs");
  revalidatePath("/");
}

async function deleteProgram(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await prisma.program.delete({ where: { id } });

  revalidatePath("/admin/programs");
  revalidatePath("/");
}

export default async function AdminProgramsPage() {
  const programs: Array<{
    id: string;
    title: string;
    category: string | null;
    status: ProgramStatus;
    isFeatured: boolean;
    presenter: { fullName: string } | null;
  }> = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      presenter: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">PROGRAMS</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Manage Programs</h1>
        <p className="mt-2 text-sm text-slate-600">Create and publish radio programs for the public website.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Create Program</h2>
        <ProgramForm onSubmit={createProgram} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Recent Programs</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Featured</th>
                <th className="px-3 py-2">Presenter</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program: {
                id: string;
                title: string;
                category: string | null;
                status: ProgramStatus;
                isFeatured: boolean;
                presenter: { fullName: string } | null;
              }) => (
                <tr key={program.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                  <td className="px-3 py-2 font-medium text-slate-900">{program.title}</td>
                  <td className="px-3 py-2">{program.category || "—"}</td>
                  <td className="px-3 py-2">{program.status}</td>
                  <td className="px-3 py-2">{program.isFeatured ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{program.presenter?.fullName ?? "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <form action={updateProgramStatus} className="inline-flex gap-2">
                        <input type="hidden" name="id" value={program.id} />
                        <input
                          type="hidden"
                          name="isFeatured"
                          value={program.isFeatured ? "false" : "true"}
                        />
                        <input type="hidden" name="status" value={program.status} />
                        <button className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-100">
                          {program.isFeatured ? "Unfeature" : "Feature"}
                        </button>
                      </form>

                      {program.status !== "PUBLISHED" ? (
                        <form action={updateProgramStatus}>
                          <input type="hidden" name="id" value={program.id} />
                          <input type="hidden" name="status" value="PUBLISHED" />
                          <input type="hidden" name="isFeatured" value={String(program.isFeatured)} />
                          <button className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                            Publish
                          </button>
                        </form>
                      ) : (
                        <form action={updateProgramStatus}>
                          <input type="hidden" name="id" value={program.id} />
                          <input type="hidden" name="status" value="DRAFT" />
                          <input type="hidden" name="isFeatured" value={String(program.isFeatured)} />
                          <button className="rounded-full border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50">
                            Draft
                          </button>
                        </form>
                      )}

                      <form action={deleteProgram}>
                        <input type="hidden" name="id" value={program.id} />
                        <button className="rounded-full border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
