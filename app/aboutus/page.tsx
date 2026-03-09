import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import SiteHeader from "../components/site-header";
import { getPublicSiteSettings } from "@/lib/site-settings";

const managementCommittees = [
  {
    name: "Barr. Shobule Oladipo.O.",
    role: "President",
    image: "/lascofed-assets/president-vnAf_8ZL.png",
  },
  {
    name: "Mr. Ogunsanu Ayuba",
    role: "1st Vice President",
    image: "/lascofed-assets/vp-Bm1mNfN-.png",
  },
  {
    name: "Mr. Athanhode Jeremiah",
    role: "2nd Vice President",
    image: "/lascofed-assets/vpp-CZnAzEzE.png",
  },
  {
    name: "Mr. Aderoku Akinpelu Goriola",
    role: "3rd Vice President",
    image: "/lascofed-assets/vppp-D3rRMc3U.png",
  },
  {
    name: "Mr. Gbenga Ibilola",
    role: "4th Vice President",
    image: "/lascofed-assets/vpppp-CC035Rrd.png",
  },
  {
    name: "Mr. Safuraini Tunji",
    role: "5th Vice President",
    image: "/lascofed-assets/vppppp-4zNlps6o.png",
  },
  {
    name: "Alhaja. Oshodi Bakare",
    role: "6th Vice President",
    image: "/lascofed-assets/vpppppp-OmQZQpqK.png",
  },
  {
    name: "Princess Olukokun A. Olufunmilola",
    role: "W.I.C President",
    image: "/lascofed-assets/wic-DBXWI0wM.png",
  },
  {
    name: "Alhaji Shabi Ismail",
    role: "Treasurer",
    image: "/lascofed-assets/treasurer-B2Eanqm0.png",
  },
  {
    name: "Mrs. Ebun Akin-Falaiye",
    role: "Executive Secretary",
    image: "/lascofed-assets/executive-DIpXNMIf.png",
  },
];

const workingCommittees = [
  ["Mr. Gbenga Ibilola", "Personnel Committee"],
  ["Mr. Ogunsanu Ayuba", "Education Committee"],
  ["Mr. Aderoku Akinpelu Goriola", "Agric and Investment Committee"],
  ["Alhaja. Oshodi Bakare", "Bulk Purchase Committee"],
  ["Princess Olukokun A. Olufunmilola", "Monitoring/Membership Committee"],
  ["Mr. Athanhode Jeremiah", "Publicity Committee"],
  ["Alhaji Shabi Ismail", "Project and Building Committee"],
  ["Mr. Safuraini Tunji", "Cooperative Account Managers Committee"],
];

export default async function AboutUsPage() {
  const settings = await getPublicSiteSettings();

  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader audioStreamUrl={settings.radioStreamUrl} videoStreamUrl={settings.videoStreamUrl} />

      <main>
        <section className="relative isolate overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-700 to-teal-700">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/lascofed-assets/f-RHrsGjF0.JPG"
              alt="LASCOFED cooperative meeting"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-5 md:px-8 md:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs tracking-wide">
              <BuildingOffice2Icon className="h-4 w-4" />
              WHO WE ARE
            </p>
            <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              We are the State Apex Body for allregistered Cooperative Societies.
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Who We Are</h2>
          <div className="mt-5 space-y-4 text-slate-600">
            <p>
              Lagos Co-operative Thrift and Credit Union Ltd was established in 1952 and registered in
              1956 as the parent body for all the cooperative societies in the then Lagos colony and
              Federal territory. After the creation of Lagos State in 1967 Lagos Co-operative Thrift and
              Credit Union Ltd became Lagos State Co-operative Union Ltd which was later changed to Lagos
              State Co-operative Federation Ltd (LASCOFED), on 3rd May, 1982, and registered by the Lagos
              State Director of Co-operatives.LASCOFED since inception has gone from strength to strength
              and has grown by leaps and bounds though with challenges which having been able to
              surmount.LASCOFED as the apex organization for cooperative societies in Lagos State is the
              voice of Cooperators, the Administrative Coordinator of all Secondary Cooperative Societies
              and promoter of Cooperation amongst Cooperatives.
            </p>
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 md:grid-cols-2 md:px-8">
            <article className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <UserGroupIcon className="h-7 w-7 text-emerald-700" />
                Our Mission
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  To provide qualitative Leadership for the Co-operative Movement in Lagos State.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  To promote, develop, co-ordinate and represent the various types of co-operative
                  societies in the interest of their members
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  To build capacity in the Movement and for the Movement by way of continuous education of
                  members.
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <AcademicCapIcon className="h-7 w-7 text-emerald-700" />
                Our Vision
              </h3>
              <p className="mt-5 text-sm text-slate-600">
                To make the Co-operative Movement a reference point for economic empowerment programs in
                Lagos State in particular and Nigeria in general.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  Help business development
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  Good and efficient financial planning
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  Analyze a small potential into a big one
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">LASCOFED MANAGEMENT COMMITTEES</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {managementCommittees.map((member) => (
              <article key={member.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={420}
                  height={420}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-xs text-emerald-700">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
            <h2 className="text-2xl font-bold md:text-3xl">LASCOFED WORKING COMMITTEES</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workingCommittees.map(([name, committee]) => (
                <article key={committee} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-700">
                    <MegaphoneIcon className="h-4 w-4" />
                    {committee}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">{name}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}



