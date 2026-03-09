"use client";

import { RadioIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import LiveVideoPlayer from "./live-video-player";

type Position = {
  x: number;
  y: number;
};

type FloatingRadioPlayerProps = {
  audioStreamUrl: string;
  videoStreamUrl: string;
};

export default function FloatingRadioPlayer({ audioStreamUrl, videoStreamUrl }: FloatingRadioPlayerProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const clampPosition = (nextX: number, nextY: number): Position => {
    const cardWidth = cardRef.current?.offsetWidth ?? 320;
    const cardHeight = cardRef.current?.offsetHeight ?? 150;
    const maxX = Math.max(8, window.innerWidth - cardWidth - 8);
    const maxY = Math.max(8, window.innerHeight - cardHeight - 8);

    return {
      x: Math.min(Math.max(8, nextX), maxX),
      y: Math.min(Math.max(8, nextY), maxY),
    };
  };

  useEffect(() => {
    const setInitialPosition = () => {
      const cardHeight = cardRef.current?.offsetHeight ?? 150;
      const initialX = 16;
      const initialY = window.innerHeight - cardHeight - 16;
      setPosition(clampPosition(initialX, initialY));
    };

    const frame = window.requestAnimationFrame(setInitialPosition);

    const onResize = () => {
      setPosition((prev) => {
        if (!prev) {
          return prev;
        }
        return clampPosition(prev.x, prev.y);
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPosition((prev) => {
        if (!prev) {
          return prev;
        }
        return clampPosition(prev.x, prev.y);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isCollapsed]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!position) {
      return;
    }

    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const nextX = event.clientX - dragOffsetRef.current.x;
    const nextY = event.clientY - dragOffsetRef.current.y;
    setPosition(clampPosition(nextX, nextY));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      ref={cardRef}
      className={`fixed z-50 rounded-2xl border border-slate-200 bg-white shadow-xl ${
        isCollapsed ? "w-auto max-w-[calc(100vw-1rem)]" : "w-[min(22rem,calc(100vw-1rem))]"
      }`}
      style={{
        left: position?.x ?? 16,
        top: position?.y ?? -9999,
      }}
    >
      <div
        className={`flex cursor-grab items-center gap-2 rounded-t-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <RadioIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">COOP Online Radio</span>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="ml-auto rounded-full border border-black bg-black px-2.5 py-0.5 text-[10px] font-bold text-white transition hover:bg-black/90"
          aria-label={isCollapsed ? "Expand player" : "Collapse player"}
        >
          {isCollapsed ? "+" : "−"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-3 p-4">
          <audio controls preload="none" className="w-full" src={audioStreamUrl}>
            Your browser does not support the audio element.
          </audio>
          <div className="flex flex-wrap gap-2">
            <a
              href={audioStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Open Stream
            </a>
            <button
              type="button"
              onClick={() => setIsLiveOpen(true)}
              className="inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
            >
              Watch Live
            </button>
          </div>
        </div>
      )}

      {isLiveOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">COOP Live Stream</h3>
              <button
                type="button"
                onClick={() => setIsLiveOpen(false)}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <LiveVideoPlayer streamUrl={videoStreamUrl} className="aspect-video w-full rounded-xl bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}
