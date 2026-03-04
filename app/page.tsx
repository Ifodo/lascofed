import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  NewspaperIcon,
  PhoneIcon,
  TableCellsIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import SiteHeader from "./components/site-header";
import directoryRows from "./data/directory-data.json";
import DirectoryTable from "./components/directory-table";
import HeroMotion from "./components/hero-motion";
import CountUpNumber from "./components/count-up-number";
import NewsletterForm from "./components/newsletter-form";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const services = [
  {
    title: "Promotion Of Co-operative Societies",
    description:
      "Actively encouraging the growth and development of new and existing cooperatives.",
    icon: UserGroupIcon as IconComponent,
  },
  {
    title: "Education and Training",
    description:
      "Comprehensive schemes for training, licensing, and regulation of cooperative account managers.",
    icon: AcademicCapIcon as IconComponent,
  },
  {
    title: "Consultancy and Advisory",
    description:
      "Expert guidance on cooperative governance, operations, and compliance for long-term sustainability.",
    icon: ChatBubbleLeftRightIcon as IconComponent,
  },
  {
    title: "Educational Events",
    description:
      "Training sessions, conferences, retreats, seminars, and educational tours for members.",
    icon: CalendarDaysIcon as IconComponent,
  },
  {
    title: "Co-operative Resources",
    description:
      "Production and distribution of official cooperative stationery and resources.",
    icon: BookOpenIcon as IconComponent,
  },
  {
    title: "CoopLight NewsLetter",
    description:
      "Regular publication that keeps members informed, connected, and inspired.",
    icon: NewspaperIcon as IconComponent,
  },
];

const events = [
  ["2021 LASCOFED Leaders Con", "24 October, 2021"],
  ["2022 LASCOFED Leaders Con", "15 November, 2022"],
  ["2023 Cooperative Leaders Con", "01 December, 2023"],
  ["2024 Cooperative Leaders Con", "28 February, 2024"],
];

const testimonials = [
  [
    "Mrs. Adunni Oyewole",
    "President, Evergreen Agro Cooperative Society",
    "With LASCOFED's support, we became fully compliant and more efficient.",
  ],
  [
    "Mr. Emeka Okoro",
    "General Secretary, Creative Hands Youth Cooperative",
    "We got legal help, exposure, and mentorship. LASCOFED truly supports young co-ops.",
  ],
  [
    "Mrs. Bisi Adeniran",
    "Vice President, Lagos Textile Cooperative Union",
    "The customer service has been exceptional and consistently reliable.",
  ],
];

const heroImages = [
  "/lascofed-assets/slide2-ZM_zj46l.jpg",
  "/lascofed-assets/building-ICgzlqVk.jpg",
  "/lascofed-assets/youth1-B2ABNsDO.jpg",
];

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader />

      <main>
        <section
          id="home"
          className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-700"
        >
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <HeroMotion images={heroImages} />
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-5 md:px-8 md:py-24 lg:py-28">
            <p className="hero-reveal mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs tracking-wide">
              Monday - Friday • 9 AM - 5 PM
            </p>
            <h1 className="hero-reveal hero-reveal-delay-1 max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-6xl">
              Lagos State Cooperative Federation (LASCOFED) Online Radio
            </h1>
            <p className="hero-reveal hero-reveal-delay-2 mt-5 max-w-2xl text-sm text-emerald-50 sm:text-base md:mt-6 md:text-lg">
              As the apex body for cooperative societies in Lagos State, LASCOFED leads with innovation,
              advocacy, and support for sustainable development.
            </p>
            <div className="hero-reveal hero-reveal-delay-3 mt-8 flex flex-wrap gap-3">
              <a
                href="#services"
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Explore Services
              </a>
              <a
                href="/contact"
                className="rounded-full border-2 border-red-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600/20"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-5 md:grid-cols-2 md:px-8 md:py-12">
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg italic text-slate-700">
              “Cooperatives are a reminder to the international community that it is possible to pursue
              both economic viability and social responsibility.”
            </p>
            <footer className="mt-4 text-sm font-semibold text-emerald-700">— Ban Ki-moon</footer>
          </blockquote>
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg italic text-slate-700">
              “Cooperatives empower communities, foster shared prosperity, and uphold democratic values
              in business.”
            </p>
            <footer className="mt-4 text-sm font-semibold text-emerald-700">
              — International Cooperative Alliance
            </footer>
          </blockquote>
        </section>

        <section className="bg-white py-10 md:py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-5 md:grid-cols-3 md:px-8">
            <div className="rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-emerald-700">
                <CountUpNumber end={24} />
              </p>
              <p className="mt-2 text-sm text-slate-600">Multipurpose Cooperative Unions across Lagos State.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-emerald-700">
                <CountUpNumber end={3000} suffix="+" />
              </p>
              <p className="mt-2 text-sm text-slate-600">Registered and active societies and organizations.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-emerald-700">
                <CountUpNumber end={2000000} />
              </p>
              <p className="mt-2 text-sm text-slate-600">Cooperative members in various occupations statewide.</p>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <p className="text-sm font-semibold tracking-widest text-emerald-700">OUR SERVICES</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            We assist Cooperatives to grow in Operations
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            At LASCOFED, we are dedicated to fostering the sustainable growth and success of cooperative
            societies throughout Lagos State.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 py-12 text-white md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Empowering Youth and Women in the Cooperative Movement.
              </h2>
              <p className="mt-4 text-slate-300">
                LASCOFED creates inclusive platforms where young people and women can thrive through
                business education, mentorship, and access to cooperative opportunities.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Image
                src="/lascofed-assets/youth1-B2ABNsDO.jpg"
                alt="Youth in cooperative program"
                width={800}
                height={560}
                className="h-56 w-full rounded-2xl object-cover"
              />
              <Image
                src="/lascofed-assets/youth2-dQ3wl4jU.jpg"
                alt="Women in cooperative initiative"
                width={800}
                height={560}
                className="h-56 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        <section id="directory" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <p className="text-sm font-semibold tracking-widest text-emerald-700">OUR DIRECTORY</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <TableCellsIcon className="h-7 w-7 text-emerald-700" />
            Find a Cooperative Union Near You
          </h2>
          <div className="mt-6">
            <DirectoryTable rows={directoryRows} pageSize={6} />
          </div>
        </section>

        <section id="events" className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
            <p className="text-sm font-semibold tracking-widest text-emerald-700">EVENTS</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Stay Connected with LASCOFED</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {events.map(([title, date]) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-emerald-700">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {date}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <p className="text-sm font-semibold tracking-widest text-emerald-700">TESTIMONIALS</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">What Our Members Say</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {testimonials.map(([name, role, quote]) => (
              <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-amber-500">★★★★★</p>
                <p className="mt-3 text-sm text-slate-600">{quote}</p>
                <p className="mt-4 font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-[#070b14] py-12 text-white md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Subscribe to CoopLight NewsLetter!</h2>
              <p className="mt-3 max-w-lg text-white/85">
                Stay informed with updates, publications, and opportunities from Lagos State Cooperative
                Federation.
              </p>
              <NewsletterForm />
            </div>
            <div className="space-y-2 text-sm text-white/85">
              <p className="font-semibold text-white">Contact Information</p>
              <p className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Plot 13, Isaacstan Close, Off Wempco Road, Ogba, Lagos, Nigeria
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                +2348132930811
              </p>
              <p className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                contact@lascofed.com
              </p>
              <div className="pt-2">
                <p className="font-semibold text-white">Follow Us</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="http://www.instagram.com/lascofedcoop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/85 transition hover:border-white hover:text-white"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm9.5 2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                    </svg>
                  </a>
                  <a
                    href="https://web.facebook.com/Lascofedcoop/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/85 transition hover:border-white hover:text-white"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 22v-8.2h2.75l.41-3.2H13.5V8.55c0-.93.26-1.56 1.59-1.56h1.7V4.12c-.82-.09-1.64-.14-2.47-.14-2.45 0-4.13 1.5-4.13 4.24v2.37H7.5v3.2h2.69V22h3.31Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-start justify-start md:col-span-2 lg:col-span-1 lg:justify-end">
              <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                <Image
                  src="/footer-assets/cooperative-federation-nigeria.png"
                  alt="Co-operative Federation of Nigeria"
                  width={180}
                  height={120}
                  className="h-auto w-[130px]"
                />
                <Image
                  src="/footer-assets/international-cooperative-alliance.png"
                  alt="International Cooperative Alliance"
                  width={200}
                  height={100}
                  className="h-auto w-[150px]"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-7xl px-4 text-center text-xs text-white/70 sm:px-5 md:px-8">
            <p>©{new Date().getFullYear()} LASCOFED. All rights reserved. | Powered by Elektran Integrated Services</p>
          </div>
        </section>
      </main>
    </div>
  );
}



