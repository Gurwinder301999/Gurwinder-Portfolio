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
  /**
   * Distinguishes the employment record from education. The site renders every
   * entry in one list, but the resume needs them in separate sections, so this
   * is the single source of truth for that split.
   */
  kind: 'work' | 'education';
};

export const timeline: TimelineEntry[] = [
  {
    period: 'Dec 2024 — Present',
    title: 'IT Support Engineer',
    place: 'Cromptech Integrated Solutions Pvt. Ltd. · Delhi',
    detail:
      'Support end users with desktops, laptops, printers, and network devices, plus VoIP server operations, user provisioning, preventive maintenance, and LAN/WAN troubleshooting.',
    icon: Building2,
    kind: 'work',
  },
  {
    period: '2020 — 2024',
    title: 'BCA with AI Engineering — 80%',
    place: 'Punjabi University, Patiala',
    detail:
      'Bachelor of Computer Applications with a specialization in AI Engineering, supported by a self-built home lab for LAN/WAN, firewall, and self-hosted VoIP experiments.',
    icon: GraduationCap,
    kind: 'education',
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
      'LAN/WAN setup and monitoring, DHCP and DNS configuration, subnetting, switch and router fundamentals, and firewall basics — using Ping, Traceroute, and NSLookup to narrow a fault down to its actual cause.',
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
  /**
   * Plain-language walkthrough of how the system actually works, written for a
   * reader who is technical but not a specialist in this stack. Each entry
   * explains one mechanism end to end, so the case study teaches rather than
   * just asserts.
   */
  howItWorks: string[];
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
    id: 'dalmia-bros-voip',
    number: '01',
    category: 'Client Deployment',
    name: 'Dalmia Bros.',
    period: 'July 2026 — Present',
    location: 'Delhi, India',
    tagline: '30+ Endpoint VoIP Rollout, End to End',
    summary:
      'VoIP infrastructure deployment — 30+ IP phones connected to a call server I configured, cabled, and commissioned.',
    overview:
      'I led the end-to-end VoIP deployment for Dalmia Bros., taking the project from structured cabling and hardware installation through server configuration to a live network of more than 30 IP phones. Every extension was provisioned, tested, and handed over with working call routing.',
    challenge:
      'The client needed to move off a limited legacy phone system onto a scalable internal telephony network without disrupting daily office communication, while keeping the existing desk layout and dial plan intact for staff.',
    solution:
      'I installed and cabled each desk endpoint, configured the call server and its provisioning settings, mapped extensions to users, and ran end-to-end call tests across every handset before sign-off.',
    howItWorks: [
      'An IP desk phone is not a traditional handset. It is a small computer with a network port, a speaker, and a numeric keypad, so it needs power and a data outlet rather than a dedicated copper pair back to a phone exchange.',
      'When a call starts, the phone sends a SIP message to the call server asking to be connected. The server checks whether the number is an internal extension, a department ring group, or an outside line, then routes the call and tells both phones where to send their audio.',
      'The audio itself never travels to the server as sound. It is converted into small packets and streamed directly between the two phones in real time, which is why latency, packet loss, and jitter matter more than raw bandwidth on a voice network.',
      'Voice traffic is separated from office data onto its own VLAN. If someone starts a large download on the same wire, the phone traffic is prioritised so the call stays clear instead of breaking up.',
      'Provisioning replaces manual configuration. Instead of setting up each phone by hand, the server delivers a configuration file to every handset automatically, so a change to the dial plan is pushed to the whole office in one step.',
      'Because a phone that registers successfully may still route calls incorrectly, I tested every endpoint for outbound, inbound, internal, and transfer calls before marking it as handed over.',
    ],
    architecture: [
      'An on-premises VoIP server handling call routing, extension registration, and dial plans',
      'Structured Cat6 cabling from the server room to each desk outlet, terminated and tested',
      'Dedicated IP desk phones configured with extensions, codec settings, and QoS tags',
      'Separate voice VLAN segmentation so voice traffic stays isolated from office data',
    ],
    keyDeliverables: [
      'Installation, cabling, and testing of more than 30 IP phone endpoints across the office',
      'Configuration of the VoIP server, extensions, dial plans, and provisioning templates',
      'User, department, and floor-plan mapping so every extension reached the right handset',
      'Call quality and connectivity testing on every endpoint before handover',
      'Staff training on call handling, forwarding, and voicemail, plus written user notes',
    ],
    highlights: [
      'Led the end-to-end installation and server configuration for the deployment.',
      'Connected a network of 30+ VoIP phones, with every extension tested and handed over.',
      'Delivered user training and post-deployment support.',
    ],
    stats: [
      { label: 'IP Phones Connected', value: '30+' },
      { label: 'Scope', value: 'End to End' },
      { label: 'Deployment', value: 'On Schedule' },
      { label: 'Status', value: 'Live' },
    ],
    tech: ['VoIP', 'IP-PBX', 'SIP', 'Structured Cabling', 'VLAN QoS', 'User Training'],
    visuals: { leftTop: 'devices', leftBottom: 'terminal', right: 'chart' },
  },
  {
    id: 'tdi-ip-phone',
    number: '02',
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
      'The client needed a voice network that delivered consistent call quality, clear audio across departments, and secure access for remote staff, all while keeping day-to-day business calls running without interruption.',
    solution:
      'I configured dedicated voice VLANs with DHCP options 66 and 150 for automatic phone configuration, provisioned SIP endpoints, set up ring groups and IVR routing, and tested quality of service across every wired drop.',
    howItWorks: [
      'DHCP options 66 and 150 are the mechanism that makes a phone configure itself. When a handset plugs into a network outlet, it asks the DHCP server for an address, and those two options tell it where to fetch its configuration file from, so nobody has to touch the handset.',
      'Quality of service works by giving voice traffic priority on the switch. Each packet carries a priority marker, and the switch forwards marked voice packets ahead of ordinary file and web traffic whenever the link gets busy.',
      'A ring group is one number that several phones answer together, so a call to a department reaches whoever is available instead of one fixed desk. The interactive voice response menu sits in front of that group and collects the caller\'s choice before handing the call over.',
      'A zero-downtime cutover means the new system runs in parallel with the old one, every extension is tested on the new platform, and only then is the legacy service withdrawn, so the office never loses the ability to make a call.',
      'Call quality is measured rather than assumed. Latency is the delay, packet loss is audio dropping out, and the Mean Opinion Score combines them into a single 1 to 5 rating that reflects what a listener actually perceives.',
      'SRTP encrypts the media stream in transit, so a call cannot be intercepted on the internal network the way an analogue conversation on a copper pair could be.',
    ],
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
    id: 'chhattisgarh-bhawan-security',
    number: '03',
    category: 'Client Deployment',
    name: 'Chhattisgarh Bhawan',
    period: 'January 2026 — June 2026',
    location: 'Chhattisgarh, India',
    tagline: 'IP CCTV, Secure Data Networking, Enterprise Wi-Fi & Biometric Access Control',
    summary: 'Integrated security and networking — IP CCTV, data networking, enterprise Wi-Fi, and biometric access control.',
    overview:
      'At Chhattisgarh Bhawan I deployed a comprehensive building-wide infrastructure covering physical security and network services together. The scope included IP CCTV surveillance, a secure segmented data network, enterprise-grade Wi-Fi coverage, and a biometric access control system, all commissioned and handed over as one coordinated build.',
    challenge:
      'The building required surveillance coverage, controlled entry, and reliable connectivity to run as one secure environment, with cameras, access readers, and network equipment unable to interfere with each other over shared cabling and power.',
    solution:
      'I ran a dedicated PoE backbone for the cameras, segmented the data network into isolated VLANs, deployed managed access points for full-building Wi-Fi coverage, and integrated the biometric readers onto the same controlled access domain.',
    howItWorks: [
      'Power over Ethernet removes the biggest cost in camera installations. A PoE switch sends electrical power and data down the same cable, so each camera needs one outlet instead of a data point and a separate power socket, which is what makes a whole-floor camera run practical to cable.',
      'An IP camera is a small computer with a lens, so it records in digital form and sends video across the network rather than sending a signal to a tape machine. That is what makes live viewing, motion search, and remote playback possible from a phone or a browser.',
      'Segmentation is what stops the systems interfering. Each camera, each office, and each access reader sits on its own VLAN, and traffic is only permitted between the segments that genuinely need to talk, so a fault or a flood of video traffic cannot take the access control offline.',
      'Enterprise Wi-Fi differs from a home router because a single access point cannot cover a whole building. Overlapping managed access points are tuned by hand so a user walking between floors hands over from one to the next without dropping the connection.',
      'A biometric reader does not open a door by itself. It captures the fingerprint or face, converts it into a mathematical template, and sends that template to a central controller, which alone decides whether to release the lock and records the entry for audit.',
      'Running these as one build meant a single cable plan, a single addressing scheme, and one commissioning pass, rather than four vendors each adding their own infrastructure and leaving gaps between them.',
    ],
    architecture: [
      'A PoE switch backbone supplying data and power to every IP camera on a single cable run',
      'VLAN-segmented data network isolating CCTV, office data, and access control from one another',
      'Managed enterprise access points providing full-building Wi-Fi coverage with per-floor tuning',
      'Biometric access readers wired back to a central controller on a dedicated security VLAN',
    ],
    keyDeliverables: [
      'Deployment and commissioning of IP CCTV cameras with live viewing, recording, and playback',
      'Structured cabling, PoE switch configuration, and port mapping for every camera and reader',
      'Secure data networking with VLAN segmentation, DHCP, and controlled inter-VLAN routing',
      'Enterprise Wi-Fi deployment across all floors, including SSID, security, and coverage tuning',
      'Biometric access control installation, reader enrollment, and admin handover',
    ],
    highlights: [
      'Deployed a comprehensive infrastructure covering IP CCTV, data networking, enterprise Wi-Fi, and biometric access control.',
      'Segmented the network so CCTV, data, and access control systems operate independently.',
      'Commissioned and handed over every system as one coordinated build.',
    ],
    stats: [
      { label: 'Systems Delivered', value: '4' },
      { label: 'Camera Type', value: 'IP / PoE' },
      { label: 'Network Model', value: 'Segmented' },
      { label: 'Entry Control', value: 'Biometric' },
    ],
    tech: ['IP CCTV', 'PoE Switching', 'VLAN', 'Enterprise Wi-Fi', 'Biometric Access', 'Structured Cabling'],
    visuals: { leftTop: 'topology', leftBottom: 'devices', right: 'console' },
  },
  {
    id: 'lg-house-voip',
    number: '04',
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
    howItWorks: [
      'Asterisk is software that replaces the hardware phone exchange. A PJSIP channel manages each registered handset, RTP carries the actual audio, and a dial plan is the set of rules that decides where any dialled number should go.',
      'Because the server is a normal Linux machine, it is exposed to the same attack surface as any internet-facing host. Fail2ban watches the authentication log for repeated failed SIP logins and automatically adds the offending addresses to a block list.',
      'The iptables ruleset decides what the server is allowed to accept. Locking it down to the specific ports telephony needs, and dropping everything else, means an exposed service is not reachable merely because it happened to be listening.',
      'Kernel tuning matters because voice is timing-sensitive. Increasing the socket buffers and connection queue stops the server dropping packets under a burst of calls, which is what a human hears as a clipped or breaking call.',
      'Systemd supervises the service rather than trusting it to stay up. If Asterisk stops unexpectedly, the watchdog restarts it automatically, and the daily log report surfaces disk pressure, failed registrations, and authentication attempts before they become an outage.',
      'Failover trunks mean the office can still make and receive calls when the primary carrier path fails, because the server has a second route configured and moves to it automatically.',
    ],
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
    number: '05',
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
    howItWorks: [
      'A lab earns its value by letting a change be tested before it reaches a client. Anything I plan to deploy, whether a firewall rule, a subnet, or a dial plan, is built and broken on purpose here first, so the failure costs me a Saturday instead of a production incident.',
      'Two network cards on the firewall are what make the lab behave like a real site. One faces an isolated subnet standing in for the internet, the other faces the internal network, and the rules between them are the same border controls a business would deploy.',
      'Variable length subnetting is the discipline that keeps those networks from colliding. Each subnet is allocated to the size it genuinely needs, which is why a lab with a handful of hosts reserves a small management range and a larger one for servers and workstations.',
      'Active Directory gives a group of Windows machines a shared identity. Users and computers join the domain once, and Group Policy then applies password rules, screen lock settings, and software restrictions to every machine without visiting each desk.',
      'Network level authentication makes remote access safe to expose. Instead of trusting the network the machine happens to be on, it verifies the user\'s credentials directly against the domain controller before granting a session.',
      'Wireshark is where the lab turns from a box of devices into a teaching tool. Capturing a real handshake and SIP registration makes visible what the documentation describes, and it is how the intermittent problems from the service desk become reproducible faults I can actually fix.',
    ],
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
