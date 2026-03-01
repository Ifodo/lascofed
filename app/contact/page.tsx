import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import ContactForm from "../components/contact-form";
import SiteHeader from "../components/site-header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main>
        <section className="bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 py-14 text-white md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
            <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest">
              CONTACT US
            </p>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">Get in touch with us!</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
              Reach out for cooperative inquiries, membership support, partnerships, and media requests.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-5 md:grid-cols-2 md:items-start md:gap-8 md:px-8 md:py-14">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill the form and our team will get back to you as soon as possible.
            </p>
            <ContactForm />
          </article>

          <aside className="space-y-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest text-red-700">OFFICE ADDRESS</p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                LASCOFED Headquarters, Plot 123, Ogba Industrial Estate, Ogba, Lagos
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest text-red-700">PHONE NUMBER</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <PhoneIcon className="h-5 w-5 text-red-700" />
                +234 (0) 90 5871 6564
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest text-red-700">EMAIL ADDRESS</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <EnvelopeIcon className="h-5 w-5 text-red-700" />
                contact@lascofed.com
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest text-red-700">WORKING HOURS</p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                Monday - Friday: 8:00AM – 5:00PM
                <br />
                Sunday: Closed
              </p>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
