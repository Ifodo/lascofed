import Image from "next/image";
import SiteHeader from "../components/site-header";
import PortfolioGallery from "../components/portfolio-gallery";
import portfolioData from "../data/portfolio-data.json";

export default function PortfolioPage() {
  const totalPhotos = portfolioData.reduce((sum, album) => sum + album.imageCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-700">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/lascofed-assets/coopconf23a-UpITIXNs.jpg"
              alt="Our Portfolio"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-5 md:px-8 md:py-24">
            <p className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest">
              OUR PORTFOLIO
            </p>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl md:text-5xl">LASCOFED Through The Years</h1>
            <p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
              Explore event albums by year and browse each collection in a focused viewer.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/30 bg-white/10 px-4 py-3">
                <p className="text-xs text-emerald-100">Albums</p>
                <p className="text-2xl font-bold">{portfolioData.length}</p>
              </div>
              <div className="rounded-xl border border-white/30 bg-white/10 px-4 py-3">
                <p className="text-xs text-emerald-100">Photos</p>
                <p className="text-2xl font-bold">{totalPhotos}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
            <h2 className="text-2xl font-extrabold md:text-4xl">Archive Explorer</h2>
            <p className="text-sm text-slate-500">All content extracted from LASCOFED portfolio</p>
          </div>
          <div>
            <PortfolioGallery albums={portfolioData} />
          </div>
        </section>
      </main>
    </div>
  );
}



