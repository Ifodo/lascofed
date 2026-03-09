"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  nextPath: string;
};

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setFeedback(payload.error ?? "Unable to sign in.");
        return;
      }

      router.replace(nextPath || "/admin");
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Unable to sign in.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-7 grid gap-4">
      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-slate-700">Admin Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-emerald-200 transition focus:border-emerald-600 focus:ring"
          placeholder="admin@lascofed.com"
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-slate-700">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-emerald-200 transition focus:border-emerald-600 focus:ring"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Signing in..." : "Sign In"}
      </button>

      {feedback ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
