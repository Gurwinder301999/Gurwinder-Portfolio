/**
 * Legal copy for the site, kept in one module so the router, the footer, and
 * the page index all read the same source.
 *
 * IMPORTANT: this is drafted to be accurate for how this site actually
 * behaves, not to be maximally protective. It is not legal advice and has not
 * been reviewed by an Indian advocate. Anyone relying on it for a commercial
 * launch should get it reviewed.
 */
import { profile } from './portfolio';

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
};

const updated = '26 September 2026';

const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  summary: 'What this site collects, which is almost nothing, and what it does not.',
  updated,
  sections: [
    {
      heading: 'The short version',
      body: [
        'This website does not collect, store, or transmit any personal data about you. There is no analytics, no tracking, no advertising, no cookies, and no contact form that sends anything to a server.',
        'If you email me or call me, I receive that message through your own email or phone app. That data is governed by ordinary correspondence and is not stored on this website.',
      ],
    },
    {
      heading: 'What this site collects',
      body: [
        'Nothing. The site is a static set of files. Your browser downloads the HTML, CSS, JavaScript, fonts, and images, but none of that is sent anywhere except to GitHub, which hosts the files and unavoidably sees the request in its own server logs.',
        'Choosing to email me or call me means you decide to share your name, email address, phone number, or anything you write. Please do not send passwords, government identifiers, financial details, or health information.',
      ],
    },
    {
      heading: 'Cookies and local storage',
      body: [
        'This site sets no cookies and uses no localStorage, sessionStorage, or IndexedDB. Nothing is remembered about you between visits.',
        'Because there is no tracking, no cookie consent banner is required. See the Cookie Policy for the detail.',
      ],
    },
    {
      heading: 'Third parties',
      body: [
        'The site loads nothing from third-party servers. Fonts, images, and code are all served from this site’s own origin, so no other company can observe your visit.',
        'Two links point outward: the LinkedIn profile and a Google Maps location search. Those are ordinary links. Nothing is loaded from either until you choose to follow it, and once you do, their own privacy policies apply.',
      ],
    },
    {
      heading: 'Children',
      body: [
        'This site is a personal portfolio and is not directed at children. It does not knowingly collect data from anyone, of any age.',
      ],
    },
    {
      heading: 'Your rights under the DPDP Act, 2023',
      body: [
        'Because no personal data is collected or processed, there is nothing held about you to access, correct, or erase. If you believe any data relating to you exists, contact me and I will confirm and delete it.',
        'The Digital Personal Data Protection Act, 2023 gives you rights of access, correction, completion, and erasure. Those rights are conditional on data actually being held, and none is.',
      ],
    },
    {
      heading: 'Grievance contact',
      body: ['Any privacy concern or data request can be sent to:', profile.email],
    },
    {
      heading: 'Changes',
      body: [
        'If this policy changes, the date above changes with it. Material changes will be noted here rather than applied silently.',
      ],
    },
  ],
};

const TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Terms and Conditions',
  summary: 'The rules for using this site, and the limits of what it offers.',
  updated,
  sections: [
    {
      heading: 'About these terms',
      body: [
        'By using this website you agree to these terms. If you do not agree, please stop using the site. These terms are written by an individual, not a company, and nothing here creates a legal relationship beyond ordinary use of a website.',
      ],
    },
    {
      heading: 'This is a portfolio, not a service',
      body: [
        'This site exists to show my work and experience. It does not sell anything, take payments, or run a shop. Nothing on this site is an offer capable of acceptance or a contract.',
        'The site is provided for information only. I do not guarantee it will be available, uninterrupted, or error-free.',
      ],
    },
    {
      heading: 'Professional information is not a guarantee',
      body: [
        'The experience, projects, and skills described here reflect my own background. Figures and outcomes are illustrative of the work described and are not commitments, service-level guarantees, or warranties of future performance. Please verify anything material independently, including by asking for references.',
        'This site is not an employment service and does not act as an agency. Nothing here creates a recruiter–candidate relationship.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        'The written text, layout, code, and original graphics on this site are mine unless stated otherwise. You may view the site and link to it. You may not copy or republish substantial parts of it, or use my name or likeness commercially, without written permission.',
        'The Kanit typeface is by The Kanit Project Authors and is used under the SIL Open Font License 1.1. The full license text ships in the project at src/assets/fonts/OFL.txt.',
      ],
    },
    {
      heading: 'Your conduct',
      body: [
        'Do not attempt to disrupt the site, probe it for vulnerabilities without telling me first, scrape it at scale, or use it to transmit anything unlawful. I will cooperate in good faith with any security researcher who reports a problem rather than exploiting it.',
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'To the maximum extent permitted by law, I am not liable for any loss arising from your use of this site or reliance on its content. Nothing in these terms excludes liability that cannot lawfully be excluded.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the laws of India. The courts of New Delhi have jurisdiction, subject to any mandatory consumer or local law that applies to you.',
      ],
    },
    {
      heading: 'Contact',
      body: [profile.email],
    },
  ],
};

const COOKIES: LegalDoc = {
  slug: 'cookies',
  title: 'Cookie Policy',
  summary: 'A short policy, because there is nothing to declare.',
  updated,
  sections: [
    {
      heading: 'This site uses no cookies',
      body: [
        'A cookie is a small text file a website asks your browser to store. This site sets none, and reads none from your device. It also uses no localStorage, sessionStorage, IndexedDB, or the Cache API.',
      ],
    },
    {
      heading: 'Why there is no consent banner',
      body: [
        'Cookie consent rules, including the EU ePrivacy Directive and comparable Indian DPDP obligations, apply when a site stores information on your device or reads information already stored there.',
        'This site does neither. With no cookies, no local storage, and no tracking, there is nothing to consent to, so a consent banner would be an empty checkbox. Publishing one can itself be misleading, because it implies tracking that does not happen.',
        'This statement is the notice. If that ever changes, this page changes with it, and a genuine consent mechanism will be added before any non-essential storage is introduced.',
      ],
    },
    {
      heading: 'What the site still loads',
      body: [
        'Fonts, stylesheets, scripts, and images are all served from this site’s own domain. They are ordinary file downloads, not storage, and leave nothing behind on your device.',
        'The host, GitHub, keeps standard server logs such as IP address and user agent for security and abuse prevention. That is GitHub’s processing under its own policy, not mine, and it is outside my control.',
      ],
    },
    {
      heading: 'Your browser',
      body: [
        'You can block or delete cookies and site data in your browser settings at any time. Because this site depends on none, blocking everything changes nothing about how it works.',
      ],
    },
  ],
};

const REFUNDS: LegalDoc = {
  slug: 'refunds',
  title: 'Refund Policy',
  summary: 'There are no purchases, so there is nothing to refund.',
  updated,
  sections: [
    {
      heading: 'No sales take place on this site',
      body: [
        'This website does not sell any goods, services, subscriptions, or digital content. There is no checkout, no payment processor, no cart, and no pricing.',
        'Because nothing can be bought here, no payment can be taken here, and therefore there is nothing for me to refund through this site. This policy exists so that the absence of a refund process is stated plainly rather than left to be inferred.',
      ],
    },
    {
      heading: 'If you are reading this expecting a refund',
      body: [
        'If you believe you have paid for something and want it refunded, you have almost certainly dealt with an unrelated third party. Please contact me and I will help you identify it, but I can only refund money I actually received.',
      ],
    },
    {
      heading: 'Free downloads',
      body: [
        'The résumé PDF is provided free and carries no charge, so no refund can apply to it. You are welcome to download, read, and share it for your own job search.',
      ],
    },
    {
      heading: 'Paid work, if I ever take any',
      body: [
        'I currently offer no paid products through this site. If that changes, the applicable refund terms will be published on the page for that specific product before any payment is taken, and will take precedence over this general policy.',
      ],
    },
  ],
};

export const legalDocs: LegalDoc[] = [PRIVACY, TERMS, COOKIES, REFUNDS];

export const legalDocBySlug: Record<string, LegalDoc> = Object.fromEntries(
  legalDocs.map((d) => [d.slug, d]),
);
