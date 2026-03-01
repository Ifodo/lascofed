"use client";

import { FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setFeedback(payload.error ?? "Unable to send message right now.");
        return;
      }

      setStatus("success");
      setFeedback("Subscription request sent successfully.");
      setEmail("");
    } catch {
      setStatus("error");
      setFeedback("Unable to send message right now.");
    }
  };

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm placeholder:text-white/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
      {feedback ? (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-300" : "text-red-300"}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
