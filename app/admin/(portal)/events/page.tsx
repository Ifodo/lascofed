import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugWithSuffix } from "@/lib/slugify";

const eventStatuses = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as const;
type EventRecordStatus = (typeof eventStatuses)[number];

async function createEvent(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startAt = String(formData.get("startAt") ?? "").trim();
  const registrationUrl = String(formData.get("registrationUrl") ?? "").trim();

  if (!title || !startAt) {
    return;
  }

  await prisma.event.create({
    data: {
      title,
      slug: slugWithSuffix(title),
      description: description || null,
      location: location || null,
      startAt: new Date(startAt),
      registrationUrl: registrationUrl || null,
      status: "UPCOMING",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
}

async function updateEventStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as EventRecordStatus;

  if (!id || !eventStatuses.includes(status)) {
    return;
  }

  await prisma.event.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
}

async function deleteEvent(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await prisma.event.delete({ where: { id } });

  revalidatePath("/admin/events");
  revalidatePath("/");
}

export default async function AdminEventsPage() {
  const events: Array<{
    id: string;
    title: string;
    startAt: Date;
    location: string | null;
    status: EventRecordStatus;
  }> = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    take: 50,
  });

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">EVENTS</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Manage Events</h1>
        <p className="mt-2 text-sm text-slate-600">Create upcoming conferences, trainings, and webinars.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Create Event</h2>
        <form action={createEvent} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Event title" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring" />
          <input
            name="startAt"
            type="datetime-local"
            required
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring"
          />
          <input
            name="location"
            placeholder="Location"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring"
          />
          <input
            name="registrationUrl"
            placeholder="Registration URL"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring"
          />
          <textarea
            name="description"
            rows={3}
            placeholder="Event description"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring md:col-span-2"
          />
          <button type="submit" className="justify-self-start rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 md:col-span-2">
            Create Event
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Events List</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: {
                id: string;
                title: string;
                startAt: Date;
                location: string | null;
                status: EventRecordStatus;
              }) => (
                <tr key={event.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                  <td className="px-3 py-2 font-medium text-slate-900">{event.title}</td>
                  <td className="px-3 py-2">{event.startAt.toLocaleString("en-NG")}</td>
                  <td className="px-3 py-2">{event.location || "—"}</td>
                  <td className="px-3 py-2">{event.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {event.status !== "UPCOMING" && (
                        <form action={updateEventStatus}>
                          <input type="hidden" name="id" value={event.id} />
                          <input type="hidden" name="status" value="UPCOMING" />
                          <button className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-100">Upcoming</button>
                        </form>
                      )}
                      {event.status !== "ONGOING" && (
                        <form action={updateEventStatus}>
                          <input type="hidden" name="id" value={event.id} />
                          <input type="hidden" name="status" value="ONGOING" />
                          <button className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50">Ongoing</button>
                        </form>
                      )}
                      {event.status !== "COMPLETED" && (
                        <form action={updateEventStatus}>
                          <input type="hidden" name="id" value={event.id} />
                          <input type="hidden" name="status" value="COMPLETED" />
                          <button className="rounded-full border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50">Completed</button>
                        </form>
                      )}
                      <form action={deleteEvent}>
                        <input type="hidden" name="id" value={event.id} />
                        <button className="rounded-full border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
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
