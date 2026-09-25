import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Banknote,
  Building2,
  Cable,
  Calendar,
  Code2,
  Cpu,
  Database,
  FileText,
  Gauge,
  Globe,
  GraduationCap,
  HardDrive,
  Headphones,
  KeyRound,
  Layers,
  LifeBuoy,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Network,
  Phone,
  PhoneCall,
  Printer,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Terminal,
  Timer,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  PROFILE                                                            */
/* ------------------------------------------------------------------ */
export const profile = {
  name: 'Gurwinder Singh',
  firstName: 'Gurwinder',
  role: 'IT Support Engineer & Developer',
  badge: "I'm an IT Support Engineer",
  tagline: 'A desktop, network and VoIP support engineer who keeps every system running.',
  email: 'gursingh301999@gmail.com',
  phone: '+91 87189 09145',
  phoneHref: 'tel:+918718909145',
  location: 'Paharganj, New Delhi, Delhi 110055',
  linkedin: 'https://www.linkedin.com/in/gurwinder-undefined-583937437',
  // Public-folder assets are resolved through BASE_URL so they keep working when
  // the site is served from a sub-path such as /portfolio/ on GitHub Pages.
  resumeUrl: `${import.meta.env.BASE_URL}Gurwinder-Singh-Resume.pdf`,
  photo: `${import.meta.env.BASE_URL}profile-pic.jpeg`,
  summary:
    "I'm an IT Support Engineer with 2+ years of hands-on experience in desktop support, network administration, VoIP deployment, and Windows and Linux system administration. I keep infrastructure monitored, documented, and online.",
  codeCard: [
    'const engineer = {',
    "  name: 'Gurwinder Singh',",
    "  role: 'IT Support Engineer',",
    "  stack: ['TCP/IP', 'VoIP', 'AD', 'Linux'],",
    "  uptime: '99.9%',",
    "  deployed: '25+ IP endpoints',",
    "  mindset: 'service first',",
    '};',
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                         */
/* ------------------------------------------------------------------ */
export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

/* ------------------------------------------------------------------ */
/*  HERO TECH STRIP                                                    */
/* ------------------------------------------------------------------ */
export type TechItem = { label: string; icon: LucideIcon };

export const heroTech: TechItem[] = [
  { label: 'Windows 10 / 11', icon: Monitor },
  { label: 'Active Directory', icon: KeyRound },
  { label: 'TCP/IP & DHCP', icon: Network },
  { label: 'VoIP / IP-PBX', icon: PhoneCall },
  { label: 'Rocky Linux', icon: Terminal },
  { label: 'MS 365', icon: FileText },
  { label: 'Cybersecurity', icon: ShieldCheck },
];

/* ------------------------------------------------------------------ */
/*  SCROLL MARQUEE (21 tiles -> rows of 11 + 10)                       */
/* ------------------------------------------------------------------ */
export const marqueeTiles: TechItem[] = [
  { label: 'TCP/IP', icon: Network },
  { label: 'LAN / WAN', icon: Cable },
  { label: 'DHCP', icon: Server },
  { label: 'DNS', icon: Globe },
  { label: 'Active Directory', icon: KeyRound },
  { label: 'Windows 10 / 11', icon: Monitor },
  { label: 'Windows Server', icon: HardDrive },
  { label: 'Rocky / CentOS Linux', icon: Terminal },
  { label: 'Asterisk IP-PBX', icon: PhoneCall },
  { label: 'SIP & VoIP', icon: Phone },
  { label: 'IP Phone Provisioning', icon: Smartphone },
  { label: 'MS 365 / Office', icon: FileText },
  { label: 'Ticketing & SLA', icon: Timer },
  { label: 'RDP / AnyDesk / VNC', icon: LifeBuoy },
  { label: 'Firewall Basics', icon: Lock },
  { label: 'Switch & Router Config', icon: Settings },
  { label: 'Subnetting', icon: Layers },
  { label: 'Ping / Traceroute', icon: LineChart },
  { label: 'Log Monitoring', icon: Activity },
  { label: 'Preventive Maintenance', icon: Wrench },
  { label: 'Cybersecurity Basics', icon: ShieldCheck },
];

/* ------------------------------------------------------------------ */
/*  ABOUT                                                             */
/* ------------------------------------------------------------------ */
export type Stat = { value: string; label: string; icon: LucideIcon };

export const stats: Stat[] = [
  { value: '2+', label: 'Years of Experience', icon: Calendar },
  { value: '25+', label: 'IP Endpoints Deployed', icon: PhoneCall },
  { value: '99.9%', label: 'Telecom Uptime Maintained', icon: Gauge },
  { value: '100%', label: 'Service-First Approach', icon: Trophy },
];

export const aboutText =
  "With more than two years of experience in IT support, I specialize in desktop support, network administration, and VoIP telephony. I enjoy working with teams that want their systems monitored, documented, and quietly reliable. Let's build something rock-solid together.";

export type TimelineEntry = {
  period: string;
  title: string;
  place: string;
  detail: string;
  icon: LucideIcon;
};

export const timeline: TimelineEntry[] = [
  {
    period: 'Dec 2024 — Present',
    title: 'IT Support Engineer',
    place: 'Cromptech Integrated Solutions Pvt. Ltd. · Delhi',
    detail:
      'Support end users with desktops, laptops, printers, and network devices, plus VoIP server operations, user provisioning, preventive maintenance, and LAN/WAN troubleshooting.',
    icon: Building2,
  },
  {
    period: '2020 — 2024',
    title: 'BCA with AI Engineering — 80%',
    place: 'Punjabi University, Patiala',
    detail:
      'Bachelor of Computer Applications with a specialization in AI Engineering, supported by a self-built home lab for LAN/WAN, firewall, and self-hosted VoIP experiments.',
    icon: GraduationCap,
  },
];

/* ------------------------------------------------------------------ */
/*  SKILLS                                                            */
/* ------------------------------------------------------------------ */
export type Skill = { name: string; level: number; icon: LucideIcon };

export const skills: Skill[] = [
  { name: 'Windows 10 / 11 & Server', level: 90, icon: Monitor },
  { name: 'Active Directory', level: 85, icon: KeyRound },
  { name: 'TCP/IP, LAN / WAN, DHCP, DNS', level: 88, icon: Network },
  { name: 'VoIP / IP-PBX & SIP', level: 90, icon: PhoneCall },
  { name: 'Linux (Rocky / CentOS)', level: 80, icon: Terminal },
  { name: 'Hardware & Peripherals', level: 92, icon: Printer },
  { name: 'MS 365 / Office Apps', level: 88, icon: FileText },
  { name: 'Ticketing & SLA Workflows', level: 85, icon: Timer },
  { name: 'Remote Support (RDP / VNC)', level: 82, icon: Headphones },
];

/* ------------------------------------------------------------------ */
/*  SERVICES                                                          */
/* ------------------------------------------------------------------ */
export type Service = { number: string; name: string; description: string };

export const services: Service[] = [
  {
    number: '01',
    name: 'Desktop & End-User Support',
    description:
      'Installation, configuration, and diagnostics for desktops, laptops, and printers, plus day-to-day troubleshooting of hardware, software, and connectivity issues with a service-first mindset.',
  },
  {
    number: '02',
    name: 'Network Administration',
    description:
      'LAN/WAN setup and monitoring, DHCP and DNS configuration, subnetting, switch and router fundamentals, and firewall basics — using Ping, Traceroute, and NSLookup to isolate faults quickly.',
  },
  {
    number: '03',
    name: 'VoIP & IP Telephony',
    description:
      'IP-PBX and IP phone deployment, extension provisioning, call routing, and Asterisk server configuration, including user permissions and server-side connectivity resolution.',
  },
  {
    number: '04',
    name: 'Server & Directory Administration',
    description:
      'Windows Server fundamentals and Active Directory user and group management, password resets, user permission management on Rocky and CentOS Linux, system configuration, and log monitoring.',
  },
  {
    number: '05',
    name: 'IT Infrastructure & Service Desk',
    description:
      'Ticket- and SLA-driven service desk operations using Microsoft 365 tooling and remote support over RDP, AnyDesk, and VNC, backed by preventive maintenance that keeps uptime high.',
  },
];

/* ------------------------------------------------------------------ */
/*  PROJECTS (sticky stacking cards)                                   */
/* ------------------------------------------------------------------ */
export type ProjectVisualKind = 'terminal' | 'topology' | 'console' | 'chart' | 'devices' | 'logs';

export type ProjectStat = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  number: string;
  category: string;
  name: string;
  period: string;
  location: string;
  tagline: string;
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  architecture: string[];
  keyDeliverables: string[];
  highlights: string[];
  stats: ProjectStat[];
  tech: string[];
  visuals: {
    leftTop: ProjectVisualKind;
    leftBottom: ProjectVisualKind;
    right: ProjectVisualKind;
  };
};

export const projects: Project[] = [
  {
    id: 'tdi-ip-phone',
    number: '01',
    category: 'Client Deployment',
    name: 'TDI Bhikaji Cama Place',
    period: 'June 2026 — Present',
    location: 'New Delhi, Delhi',
    tagline: 'Enterprise-grade IP Telephony & SIP Endpoint Provisioning',
    summary:
      'IP Phone (VoIP) deployment — from installation and provisioning through to post-deployment support.',
    overview:
      'At TDI Bhikaji Cama Place, I delivered an end-to-end IP telephony rollout that replaced legacy lines with a scalable, modern VoIP platform. I handled physical endpoint installation, VLAN segregation for voice traffic, automated extension provisioning, and a zero-downtime dial plan cutover.',
    challenge:
      'The client needed a voice network that delivered jitter-free call quality, clear audio across multiple departments, and secure access for remote staff, all while keeping day-to-day business calls running without interruption.',
    solution:
      'I configured dedicated voice VLANs with DHCP options 66 and 150 for automatic phone configuration, provisioned SIP endpoints, set up ring groups and IVR routing, and tested quality of service across every wired drop.',
    architecture: [
      'A dedicated voice VLAN with DSCP and QoS prioritization (CoS 5 / EF) on managed gigabit switches',
      'A centralized IP-PBX controller handling call routing, extension mapping, and failover trunks',
      'DHCP option-based auto-provisioning that delivers XML configuration templates directly to handsets',
      'Encrypted SIP signaling with SRTP for secure voice transport across the organization',
    ],
    keyDeliverables: [
      'Structured cable termination and physical installation of IP desk phones',
      'DHCP server configuration for automated TFTP and HTTP provisioning, plus voice VLAN tagging',
      'Design of the interactive voice response menu, hunt groups, and department-wise call routing',
      'End-to-end validation of latency, packet loss, and Mean Opinion Score (MOS) call quality',
      'Hands-on staff training and written user guides for call forwarding, transfers, and speed dials',
    ],
    highlights: [
      'Implemented and configured IP phone (VoIP) systems across the organization.',
      'Provisioned endpoints and extensions, then verified call functionality end to end.',
      'Delivered post-deployment troubleshooting and user training.',
    ],
    stats: [
      { label: 'Voice Quality', value: 'HD Voice' },
      { label: 'Network Uptime', value: '99.9%' },
      { label: 'Deployment', value: 'On Schedule' },
      { label: 'Phone Type', value: 'IP / SIP' },
    ],
    tech: ['VoIP', 'IP-PBX', 'SIP', 'Provisioning', 'VLAN QoS', 'DHCP Scope'],
    visuals: { leftTop: 'devices', leftBottom: 'topology', right: 'console' },
  },
  {
    id: 'lg-house-voip',
    number: '02',
    category: 'Client Deployment',
    name: 'LG House, Civil Lines',
    period: 'May 2025 — June 2025',
    location: 'Delhi, India',
    tagline: 'High-Availability Asterisk Telephony Server on Rocky Linux',
    summary:
      'VoIP and Linux server deployment — 25+ IP phone endpoints running on a Rocky Linux telephony server.',
    overview:
      'I engineered and deployed an enterprise IP telephony server running on Rocky Linux for LG House in Civil Lines. I configured the Asterisk IP-PBX software, provisioned more than 25 IP endpoints with hardened security rules, tuned Linux kernel networking parameters, and set up continuous log monitoring.',
    challenge:
      'The client, a high-profile executive office, needed robust, fault-tolerant internal and external calling with strict Linux security auditing, no system freezes, and sustained 99.9% uptime under heavy concurrent use.',
    solution:
      'I built a hardened Rocky Linux environment running Asterisk with Fail2ban protection against SIP brute-force attempts, iptables firewall filtering, rotated journal logs, and real-time trunk monitoring.',
    architecture: [
      'An enterprise Rocky Linux host with tuned sysctl network buffers and persistent audit logs',
      'An Asterisk PBX engine handling PJSIP endpoints, RTP media streams, and custom dial plans',
      'Automated Fail2ban intrusion prevention monitoring authentication failures on SIP port 5060',
      'Systemd watchdog services paired with daily log reporting and disk threshold alerts',
    ],
    keyDeliverables: [
      'Deployment, provisioning, and labeling of more than 25 IP phone endpoints across the office',
      'Asterisk IP-PBX configuration with custom dial plans, an extension matrix, and call parking',
      'Linux host hardening with SELinux enforcement, SSH key authentication, and localized firewall rules',
      'Real-time log monitoring through journalctl and the Asterisk CLI to trace jitter and dropped calls',
      'Continuous stress testing that held 99.9% telecom uptime without interruption',
    ],
    highlights: [
      'Deployed and provisioned more than 25 IP phone endpoints in an enterprise environment.',
      'Configured, optimized, and maintained the VoIP server on Rocky Linux.',
      'Monitored system logs and performance to maintain 99.9% telecom uptime.',
    ],
    stats: [
      { label: 'Active Endpoints', value: '25+' },
      { label: 'System Uptime', value: '99.9%' },
      { label: 'Platform OS', value: 'Rocky Linux' },
      { label: 'PBX Engine', value: 'Asterisk' },
    ],
    tech: ['Rocky Linux', 'Asterisk', 'VoIP', 'Log Monitoring', 'Fail2ban', 'Bash Scripting'],
    visuals: { leftTop: 'terminal', leftBottom: 'logs', right: 'chart' },
  },
  {
    id: 'cromptech-service-desk',
    number: '03',
    category: 'Personal Infrastructure',
    name: 'Service Desk & Home Lab',
    period: 'Ongoing — self-driven',
    location: 'New Delhi, Delhi',
    tagline: 'Enterprise Network Lab & Multi-Tier SLA Service Desk',
    summary:
      'A personal lab for LAN/WAN, firewall policy, and self-hosted VoIP testing that strengthens the service desk work I do at Cromptech.',
    overview:
      'I designed and operate an isolated home networking and server lab that lets me test real-world enterprise architectures before they go into production. The environment simulates multi-subnet LAN/WAN routing, firewall access control lists, Active Directory domains, and a self-hosted Asterisk VoIP PBX.',
    challenge:
      'Supporting more than 100 end users and network appliances demands fast diagnostic skills and a safe test bed where I can reproduce intermittent software failures, DNS conflicts, and voice packet latency without touching a client production network.',
    solution:
      'I built a hybrid physical and virtual lab that mirrors an enterprise topology: a pfSense firewall gateway, a Windows Server 2022 domain controller, Linux utility hosts, managed switch trunking, and remote administration benches.',
    architecture: [
      'A dual-NIC firewall router simulating WAN and LAN border security, NAT, and stateful packet inspection',
      'Windows Server Active Directory Domain Services (AD DS) managing Group Policy Objects',
      'A subnetted topology with separate management, voice, and client workstations on isolated subnets',
      'A secure remote support gateway using RDP with network level authentication, AnyDesk, and SSH bastion access',
    ],
    keyDeliverables: [
      'VLSM subnet design and DHCP server configuration with reservations for critical infrastructure',
      'Firewall access control policies, port forwarding rules, and DNS diagnostics',
      'Active Directory user and group hierarchy, password policy enforcement, and permission audits',
      'Remote support triage workflows modeled on L1 and L2 service desk SLA benchmarks',
      'Living technical documentation, topology diagrams, and automated backup and recovery plans',
    ],
    highlights: [
      'Designed and maintained a home lab for LAN/WAN, firewall policies, and self-hosted VoIP.',
      'Ran ticketing and SLA workflows with remote support over RDP, AnyDesk, and VNC.',
      'Kept documentation, asset records, and preventive maintenance schedules up to date.',
    ],
    stats: [
      { label: 'Lab Subnets', value: '4 VLANs' },
      { label: 'Active Services', value: '12 Hosts' },
      { label: 'Remote Protocols', value: 'RDP / VNC' },
      { label: 'Diagnostic Tools', value: 'CLI / Wireshark' },
    ],
    tech: ['Firewall', 'LAN / WAN', 'Active Directory', 'RDP', 'Documentation', 'Wireshark'],
    visuals: { leftTop: 'console', leftBottom: 'devices', right: 'terminal' },
  },
];

/* ------------------------------------------------------------------ */
/*  CONTACT                                                            */
/* ------------------------------------------------------------------ */
export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  download?: boolean;
};

export const contactChannels: ContactChannel[] = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: 'Phone', value: profile.phone, href: profile.phoneHref, icon: Phone },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/gurwinder-undefined-583937437',
    href: profile.linkedin,
    icon: Globe,
    external: true,
  },
  {
    label: 'Location',
    value: profile.location,
    href: 'https://www.google.com/maps/search/?api=1&query=Paharganj%2C%20New%20Delhi%2C%20Delhi%20110055',
    icon: MapPin,
    external: true,
  },
  { label: 'Resume', value: 'Download the PDF copy', href: profile.resumeUrl, icon: FileText, download: true },
  {
    label: 'Role Fit',
    value: 'Open to IT and desktop support roles',
    href: `mailto:${profile.email}?subject=IT%20Support%20role%20opportunity`,
    icon: Banknote,
  },
];

/* ------------------------------------------------------------------ */
/*  FOCUS AREAS + FOOTER                                               */
/* ------------------------------------------------------------------ */
export const focusAreas: { label: string; icon: LucideIcon }[] = [
  { label: 'Network Administration', icon: Network },
  { label: 'VoIP Technologies', icon: PhoneCall },
  { label: 'Artificial Intelligence', icon: Cpu },
  { label: 'IT Infrastructure Management', icon: Database },
  { label: 'Emerging Technologies', icon: Layers },
  { label: 'Cybersecurity Fundamentals', icon: ShieldCheck },
  { label: 'Automation & Scripting', icon: Code2 },
  { label: 'End-User Training', icon: Users },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: 'Navigate', links: navLinks },
  {
    title: 'Elsewhere',
    links: [
      { label: 'LinkedIn', href: profile.linkedin },
      { label: 'Email', href: `mailto:${profile.email}` },
      { label: 'Resume', href: profile.resumeUrl },
    ],
  },
];
