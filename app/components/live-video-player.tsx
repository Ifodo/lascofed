"use client";

import Hls from "hls.js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LIVE_VIDEO_URL = "https://ngvid.elektranbroadcast.com/hls/lascofed/mystream.m3u8";

type LiveVideoPlayerProps = {
  className?: string;
};

export default function LiveVideoPlayer({ className }: LiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const onCanPlay = () => setStatus("ready");
    const onPlaying = () => setStatus("ready");
    const onError = () => setStatus("error");

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = LIVE_VIDEO_URL;
      return () => {
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("error", onError);
      };
    }

    if (!Hls.isSupported()) {
      const timeoutId = window.setTimeout(() => setStatus("error"), 0);
      return () => {
        window.clearTimeout(timeoutId);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("error", onError);
      };
    }

    const hls = new Hls();
    hls.loadSource(LIVE_VIDEO_URL);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        setStatus("error");
      }
    });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      hls.destroy();
    };
  }, []);

  return (
    <div className={`${className ?? "w-full rounded-xl bg-black"} relative overflow-hidden`}>
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full bg-black"
      >
        Your browser does not support live video playback.
      </video>

      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/80 px-4 text-center text-white">
          <Image src="/coop_logo.png" alt="LASCOFED Logo" width={96} height={32} className="h-10 w-auto" />
          <p className="text-sm font-semibold">
            {status === "error" ? "Stream could not be loaded" : "Loading stream..."}
          </p>
        </div>
      )}

      {status === "ready" && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Stream available
        </div>
      )}
    </div>
  );
}
