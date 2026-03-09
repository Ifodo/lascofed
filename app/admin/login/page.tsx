import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth-server";
import LoginForm from "./login-form";
import ClearSignedOutParam from "./clear-signed-out-param";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
    signedOut?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin";
  const wasSignedOut = params.signedOut === "1";

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      <section className="relative flex w-[60%] items-center justify-center overflow-hidden bg-slate-900 p-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(220,38,38,0.15),transparent_35%)]" />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-300">COOP RADIO</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight">Admin Control Center</h2>
          <p className="mt-3 text-sm text-slate-300">
            Secure access for managing live programs, schedules, news updates, and events.
          </p>
          <div className="mt-7 space-y-2 text-sm text-slate-200">
            <p>• Manage published and draft radio programs</p>
            <p>• Update weekly schedules and live status</p>
            <p>• Publish newsroom and event content</p>
          </div>
        </div>
      </section>

      <section className="flex w-[40%] items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">ADMIN PORTAL</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Sign In</h1>
          <p className="mt-2 text-sm text-slate-600">Access the COOP Radio dashboard to manage broadcast content.</p>

          {wasSignedOut ? (
            <>
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                You have been signed out successfully.
              </p>
              <ClearSignedOutParam />
            </>
          ) : null}

          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}
