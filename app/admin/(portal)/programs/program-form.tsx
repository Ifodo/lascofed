"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type ProgramFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function ProgramForm({ onSubmit }: ProgramFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (imageUrl) {
      formData.set("coverImageUrl", imageUrl);
    }

    try {
      await onSubmit(formData);
      formRef.current?.reset();
      setImageUrl("");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
      <input
        name="title"
        placeholder="Program title"
        required
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring"
      />
      <input
        name="category"
        placeholder="Category (optional)"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring"
      />

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cover Image {uploading && <span className="text-emerald-600">(Uploading...)</span>}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-slate-300 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 disabled:opacity-50"
        />
        {imageUrl && (
          <div className="mt-2">
            <Image src={imageUrl} alt="Preview" width={96} height={96} className="h-24 w-auto rounded-lg border border-slate-200" />
          </div>
        )}
        <input type="hidden" name="coverImageUrl" value={imageUrl} />
      </div>

      <textarea
        name="description"
        placeholder="Program description"
        required
        rows={3}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring md:col-span-2"
      />
      <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
        <input type="checkbox" name="isFeatured" className="h-4 w-4" />
        Mark as featured
      </label>
      <button
        type="submit"
        disabled={submitting || uploading}
        className="justify-self-start rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 md:col-span-2"
      >
        {submitting ? "Creating..." : "Create Program"}
      </button>
    </form>
  );
}
