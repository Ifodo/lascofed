"use client";

import { FormEvent, useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setFeedback(payload.error ?? "Unable to send message right now.");
        return;
      }

      setStatus("success");
      setFeedback("Message sent successfully. We will contact you shortly.");
      setFormState(initialState);
    } catch {
      setStatus("error");
      setFeedback("Unable to send message right now.");
    }
  };

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-slate-700">Full Name</span>
          <input
            type="text"
            required
            value={formState.fullName}
            onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
            placeholder="Your full name"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-slate-700">Email Address</span>
          <input
            type="email"
            required
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@example.com"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-slate-700">Subject</span>
        <input
          type="text"
          required
          value={formState.subject}
          onChange={(event) => setFormState((prev) => ({ ...prev, subject: event.target.value }))}
          placeholder="How can we help?"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-slate-700">Message</span>
        <textarea
          rows={5}
          required
          value={formState.message}
          onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
          placeholder="Write your message"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-1/3 items-center justify-center self-start rounded-full bg-red-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {feedback ? (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-700" : "text-red-700"}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
