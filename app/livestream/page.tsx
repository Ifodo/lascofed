import SiteHeader from "../components/site-header";
import LiveVideoPlayer from "../components/live-video-player";

const AUDIO_STREAM_URL = "https://azstream.elektranbroadcast.com/listen/lascofed/radio.mp3";
const VIDEO_STREAM_URL = "https://ngvid.elektranbroadcast.com/hls/lascofed/mystream.m3u8";

export default function LiveStreamPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-10 md:px-8 md:py-14">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 px-6 py-10 text-white shadow-xl md:px-10">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest">
            LIVE STREAM
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">COOP Online Radio & TV</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
            Listen live and watch in real time from one dedicated stream hub.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-widest text-red-700">TV STREAM</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">Watch Live</h2>
              </div>
              <a
                href={VIDEO_STREAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
              >
                Open TV Stream URL
              </a>
            </div>

            <LiveVideoPlayer className="mx-auto mt-4 aspect-video w-full max-w-3xl rounded-xl bg-black" />
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-red-700">RADIO STREAM</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Listen Live</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enjoy COOP Online Radio with uninterrupted audio streaming.
            </p>

            <audio controls preload="none" className="mt-5 w-full" src={AUDIO_STREAM_URL}>
              Your browser does not support the audio element.
            </audio>

            <a
              href={AUDIO_STREAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Open Audio Stream
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}
