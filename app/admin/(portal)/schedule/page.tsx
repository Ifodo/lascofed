import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const dayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

async function createScheduleSlot(formData: FormData) {
  "use server";

  const dayOfWeek = Number(String(formData.get("dayOfWeek") ?? ""));
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const programId = String(formData.get("programId") ?? "").trim();
  const titleOverride = String(formData.get("titleOverride") ?? "").trim();

  if (Number.isNaN(dayOfWeek) || !startTime || !endTime) {
    return;
  }

  await prisma.scheduleSlot.create({
    data: {
      dayOfWeek,
      startTime,
      endTime,
      programId: programId || null,
      titleOverride: titleOverride || null,
      timezone: "Africa/Lagos",
      isLive: false,
    },
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/");
}

async function toggleLiveSlot(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const isLive = formData.get("isLive") === "true";

  if (!id) {
    return;
  }

  await prisma.scheduleSlot.update({
    where: { id },
    data: { isLive },
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/");
}

async function deleteScheduleSlot(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await prisma.scheduleSlot.delete({ where: { id } });

  revalidatePath("/admin/schedule");
  revalidatePath("/");
}

export default async function AdminSchedulePage() {
  const [slots, programs]: [
    Array<{
      id: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      titleOverride: string | null;
      isLive: boolean;
      program: { title: string } | null;
    }>,
    Array<{ id: string; title: string }>
  ] = await Promise.all([
    prisma.scheduleSlot.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      take: 100,
      include: {
        program: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.program.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
      take: 200,
    }),
  ]);

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">SCHEDULE</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Manage Program Schedule</h1>
        <p className="mt-2 text-sm text-slate-600">Define weekly time slots and map them to published programs.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Create Schedule Slot</h2>
        <form action={createScheduleSlot} className="mt-4 grid gap-3 md:grid-cols-2">
          <select name="dayOfWeek" required className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring">
            {dayOptions.map((day) => (
              <option key={day.value} value={day.value}>{day.label}</option>
            ))}
          </select>
          <select name="programId" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring">
            <option value="">No linked program</option>
            {programs.map((program: { id: string; title: string }) => (
              <option key={program.id} value={program.id}>{program.title}</option>
            ))}
          </select>
          <input name="startTime" type="time" required className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring" />
          <input name="endTime" type="time" required className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring" />
          <input
            name="titleOverride"
            placeholder="Title override (optional)"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring md:col-span-2"
          />
          <button type="submit" className="justify-self-start rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 md:col-span-2">
            Create Slot
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Weekly Slots</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Day</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Program</th>
                <th className="px-3 py-2">Live Flag</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot: {
                id: string;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
                titleOverride: string | null;
                isLive: boolean;
                program: { title: string } | null;
              }) => (
                <tr key={slot.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                  <td className="px-3 py-2">{dayOptions.find((day) => day.value === slot.dayOfWeek)?.label ?? slot.dayOfWeek}</td>
                  <td className="px-3 py-2">{slot.startTime} - {slot.endTime}</td>
                  <td className="px-3 py-2">{slot.titleOverride || slot.program?.title || "—"}</td>
                  <td className="px-3 py-2">{slot.isLive ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <form action={toggleLiveSlot}>
                        <input type="hidden" name="id" value={slot.id} />
                        <input type="hidden" name="isLive" value={slot.isLive ? "false" : "true"} />
                        <button className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-100">
                          {slot.isLive ? "Unset Live" : "Set Live"}
                        </button>
                      </form>
                      <form action={deleteScheduleSlot}>
                        <input type="hidden" name="id" value={slot.id} />
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
