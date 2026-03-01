"use client";

import {
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PauseIcon,
  PlayIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type PortfolioAlbum = {
  title: string;
  year: string;
  imageCount: number;
  coverImage: string;
  images: string[];
};

type PortfolioGalleryProps = {
  albums: PortfolioAlbum[];
};

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i.test(url);
}

export default function PortfolioGallery({ albums }: PortfolioGalleryProps) {
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(albums.map((album) => album.year))).sort((a, b) =>
      b.localeCompare(a),
    );
    return ["All", ...uniqueYears];
  }, [albums]);

  const [year, setYear] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedAlbumKey, setSelectedAlbumKey] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const filtered = useMemo(() => {
    const base = year === "All" ? albums : albums.filter((album) => album.year === year);
    if (!query.trim()) {
      return base;
    }
    const term = query.trim().toLowerCase();
    return base.filter((album) => album.title.toLowerCase().includes(term));
  }, [albums, query, year]);

  const totalFilteredPhotos = useMemo(
    () => filtered.reduce((sum, album) => sum + album.imageCount, 0),
    [filtered],
  );

  const activeAlbum = useMemo(() => {
    if (filtered.length === 0) {
      return null;
    }
    if (!selectedAlbumKey) {
      return filtered[0];
    }
    return filtered.find((album) => `${album.title}-${album.year}` === selectedAlbumKey) ?? filtered[0];
  }, [filtered, selectedAlbumKey]);

  const safeMediaIndex = activeAlbum
    ? Math.min(activeMediaIndex, Math.max(0, activeAlbum.images.length - 1))
    : 0;
  const activeMedia = activeAlbum?.images[safeMediaIndex] ?? "";

  useEffect(() => {
    if (!isAutoplay || !activeAlbum || activeAlbum.images.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setActiveMediaIndex((prev) => (prev + 1) % activeAlbum.images.length);
    }, 2600);

    return () => clearInterval(timer);
  }, [activeAlbum, isAutoplay]);

  useEffect(() => {
    if (!activeAlbum || activeAlbum.images.length < 2) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveMediaIndex((prev) => (prev + 1) % activeAlbum.images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveMediaIndex((prev) => (prev - 1 + activeAlbum.images.length) % activeAlbum.images.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAlbum]);

  function nextMedia() {
    if (!activeAlbum || activeAlbum.images.length <= 1) {
      return;
    }
    setActiveMediaIndex((prev) => (prev + 1) % activeAlbum.images.length);
  }

  function prevMedia() {
    if (!activeAlbum || activeAlbum.images.length <= 1) {
      return;
    }
    setActiveMediaIndex((prev) => (prev - 1 + activeAlbum.images.length) % activeAlbum.images.length);
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {years.map((item) => {
              const active = item === year;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setYear(item);
                    setSelectedAlbumKey(null);
                    setActiveMediaIndex(0);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-red-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-red-500 hover:text-red-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full lg:w-80">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedAlbumKey(null);
                setActiveMediaIndex(0);
              }}
              placeholder="Search album title"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-red-600"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Current Year</p>
            <p className="font-semibold text-slate-900">{year}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Albums</p>
            <p className="font-semibold text-slate-900">{filtered.length}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Photos</p>
            <p className="font-semibold text-slate-900">{totalFilteredPhotos}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        {activeAlbum ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="relative h-[340px] overflow-hidden rounded-xl bg-slate-100 md:h-[500px]">
              {isImageUrl(activeMedia) ? (
                <Image
                  src={activeMedia}
                  alt={`${activeAlbum.title} - ${activeMediaIndex + 1}`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 65vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-600">
                  <a
                    href={activeMedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:border-red-600 hover:text-red-700"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Open document
                  </a>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-white">
                <p className="text-xs uppercase tracking-widest text-emerald-100">Featured Album</p>
                <h3 className="mt-1 line-clamp-2 text-lg font-bold md:text-2xl">{activeAlbum.title}</h3>
                <p className="text-sm text-emerald-100">
                  {activeAlbum.year} • {activeAlbum.images.length} photos
                </p>
              </div>

              {activeAlbum.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevMedia}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                    aria-label="Previous media"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextMedia}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                    aria-label="Next media"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                <PhotoIcon className="h-4 w-4 text-emerald-700" />
                Slide {safeMediaIndex + 1} of {activeAlbum.images.length}
              </p>

              <button
                type="button"
                onClick={() => setIsAutoplay((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-600 hover:text-red-700"
              >
                {isAutoplay ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {isAutoplay ? "Pause slideshow" : "Play slideshow"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {activeAlbum.images.map((item, index) => {
                const selected = index === safeMediaIndex;
                return (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => setActiveMediaIndex(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border ${
                      selected ? "border-red-600" : "border-slate-200"
                    }`}
                  >
                    {isImageUrl(item) ? (
                      <Image
                        src={item}
                        alt={`${activeAlbum.title} thumb ${index + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-600">
                        PDF
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No albums available for this filter.
          </section>
        )}

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h3 className="text-lg font-bold text-slate-900">Album Wall</h3>
          <p className="mt-1 text-sm text-slate-500">Choose any album to focus it in the featured viewer.</p>

          <div className="mt-4 grid gap-3">
            {filtered.map((album) => {
              const isActive = activeAlbum
                ? `${album.title}-${album.year}` === `${activeAlbum.title}-${activeAlbum.year}`
                : false;

              return (
                <button
                  key={`${album.title}-${album.year}`}
                  type="button"
                  onClick={() => {
                    setSelectedAlbumKey(`${album.title}-${album.year}`);
                    setActiveMediaIndex(0);
                    setIsAutoplay(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${
                    isActive
                      ? "border-red-600 bg-red-50"
                      : "border-slate-200 bg-white hover:border-red-300"
                  }`}
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {isImageUrl(album.coverImage) ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-slate-500">File</span>
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{album.title}</p>
                    <p className="text-xs text-slate-500">
                      {album.year} • {album.imageCount} photos
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
