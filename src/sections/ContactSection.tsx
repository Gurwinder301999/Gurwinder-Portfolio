import { ArrowUpRight, Building2, Clock, Download } from 'lucide-react';
import { legalDocs } from '../data/legal';
import { contactChannels, profile } from '../data/portfolio';
import FadeIn from '../components/FadeIn';
import SectionBadge from '../components/SectionBadge';
import ContactButton from '../components/ContactButton';
import LiveProjectButton from '../components/LiveProjectButton';
import Tilt3D from '../components/three-d/Tilt3D';
import Cube3D from '../components/three-d/Cube3D';

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24"
    >
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(182,0,168,0.28),transparent_66%)] blur-3xl"
      />
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(118,33,176,0.3),transparent_66%)] blur-3xl"
      />
      <div className="float-soft pointer-events-none absolute right-[6%] top-[12%] hidden lg:block">
        <Cube3D size={64} duration={28} />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <FadeIn delay={0} y={20}>
            <SectionBadge>Let&apos;s Work Together</SectionBadge>
          </FadeIn>

          <FadeIn delay={0.08} y={30}>
            <h2 className="text-[clamp(1.9rem,5.6vw,4.4rem)] font-black uppercase leading-[0.95] tracking-tight text-[#D7E2EA]">
              Have a project <span className="hero-heading">in mind?</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.14} y={22}>
            <p className="max-w-[36rem] text-[clamp(0.9rem,1.6vw,1.1rem)] font-light leading-relaxed text-[#D7E2EA]/65">
              I&apos;m always open to discussing new projects, IT support roles, and opportunities where
              reliable infrastructure matters. Whether it&apos;s desktops, networks, or IP telephony,
              let&apos;s get your systems quiet, documented, and monitored.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={20} className="flex flex-wrap items-center gap-4">
            <ContactButton
              label={
                <>
                  Email Me
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              }
              href={`mailto:${profile.email}?subject=IT%20support%20enquiry`}
            />
            <LiveProjectButton
              label={
                <>
                  Download CV
                  <Download className="h-4 w-4" />
                </>
              }
              href={profile.resumeUrl}
              download
            />
          </FadeIn>

          <FadeIn delay={0.26} y={20}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/62 sm:text-[0.7rem]">
              <li className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#D14AC0]" aria-hidden />
                Replies within a working day
              </li>
              <li className="inline-flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-[#D14AC0]" aria-hidden />
                Currently at Cromptech · Delhi
              </li>
            </ul>
          </FadeIn>

          {/* There is no form and nothing is transmitted by this site, so
              there is no consent to collect. Saying so beats shipping an
              unclicked checkbox that implies data collection is happening. If
              a form is ever added, this becomes a required, pre-ticked-false
              consent control and the privacy policy must be updated first. */}
          <FadeIn delay={0.32} y={20}>
            <p className="max-w-[36rem] text-[0.7rem] font-light leading-relaxed text-[#D7E2EA]/60">
              These buttons open your own email or phone app. Nothing you type is sent through this
              website, and the site stores no data. Please don&apos;t include passwords, ID numbers, or
              payment details. See the{' '}
              <a
                href="#/legal/privacy"
                className="underline decoration-[#B600A8] underline-offset-2 hover:text-[#D7E2EA]"
              >
                Privacy Policy
              </a>
              .
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} y={30}>
          <Tilt3D max={7} glare className="w-full">
            <div className="rounded-[36px] border-2 border-[#D7E2EA] bg-[#0C0C0C]/90 p-5 shadow-[0_60px_140px_-70px_rgba(0,0,0,1)] backdrop-blur-sm sm:rounded-[44px] sm:p-7">
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/62 sm:text-[0.68rem]">
                Follow me
              </p>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        target={channel.external ? '_blank' : undefined}
                        rel={channel.external ? 'noreferrer noopener' : undefined}
                        download={channel.download || undefined}
                        className="group flex h-full items-start gap-3 rounded-2xl border border-[#D7E2EA]/[0.14] bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#B600A8]/45 hover:bg-white/[0.07]"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#D7E2EA]/[0.15] bg-white/[0.05]">
                          <Icon className="h-4 w-4 text-[#D7E2EA]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.58rem] font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/62">
                            {channel.label}
                          </span>
                          <span className="mt-1 block line-clamp-2 break-words text-xs font-light text-[#D7E2EA]/80 sm:text-sm">
                            {channel.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="accent-gradient mt-6 rounded-3xl p-[1px]">
                <div className="rounded-3xl bg-[#0C0C0C] p-5">
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#D7E2EA]/62">
                    Current role
                  </p>
                  <p className="mt-2 text-base font-semibold uppercase tracking-wide text-[#D7E2EA]">
                    IT Support Engineer
                  </p>
                  <p className="mt-1 text-xs font-light text-[#D7E2EA]/70">
                    Cromptech Integrated Solutions Pvt. Ltd. · Dec 2024 — Present · Delhi, India
                  </p>
                  <p className="mt-4 text-[0.68rem] font-light leading-relaxed text-[#D7E2EA]/65">
                    Desktops, network devices, Active Directory, Windows and Rocky Linux servers, and
                    Asterisk-based VoIP telephony — all documented and monitored.
                  </p>
                </div>
              </div>

              {/* Who runs the site, and how to make a data request. Required
                  context for the privacy policy to be honest, and a real
                  contact route for anyone exercising DPDP rights. */}
              <div className="mt-6 rounded-3xl border border-[#D7E2EA]/[0.14] p-5">
                <h3 className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#D7E2EA]/62">
                  Site operator
                </h3>
                <dl className="mt-3 flex flex-col gap-2 text-xs text-[#D7E2EA]/75">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-[#D7E2EA]/55">Name</dt>
                    <dd>{profile.business.legalName}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-[#D7E2EA]/55">Status</dt>
                    <dd>{profile.business.entityType}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-[#D7E2EA]/55">Data requests</dt>
                    <dd>
                      <a
                        href={`mailto:${profile.email}?subject=Data%20request`}
                        className="underline decoration-[#B600A8] underline-offset-2"
                      >
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {legalDocs.map((doc) => (
                    <li key={doc.slug}>
                      <a
                        href={`#/legal/${doc.slug}`}
                        className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#D7E2EA]/70 underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-[#D7E2EA] hover:decoration-[#B600A8]"
                      >
                        {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Tilt3D>
        </FadeIn>
      </div>
    </section>
  );
}
