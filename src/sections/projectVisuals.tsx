import type { ProjectVisualKind } from '../data/portfolio';

const PANEL =
  'relative h-full w-full overflow-hidden rounded-[32px] border border-[#D7E2EA]/[0.14] bg-[#101013] sm:rounded-[40px]';

function PanelHeader({ label, accent = '#B600A8' }: { label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2.5 sm:px-4">
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      <span className="text-[0.58rem] font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/68 sm:text-[0.65rem]">
        {label}
      </span>
      <span className="ml-auto flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D7E2EA]/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D7E2EA]/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D7E2EA]/20" />
      </span>
    </div>
  );
}

function TerminalVisual() {
  const lines = [
    { text: '$ asterisk -rx "pjsip show endpoints"', tone: 'text-[#BBCCD7]' },
    { text: '  endpoint 1001/1001  Avail  10.20.4.31', tone: 'text-[#8BE9A7]' },
    { text: '  endpoint 1002/1002  Avail  10.20.4.32', tone: 'text-[#8BE9A7]' },
    { text: '  endpoint 1003/1003  Unavail 10.20.4.33', tone: 'text-[#E0A458]' },
    { text: '$ systemctl restart voip-server', tone: 'text-[#BBCCD7]' },
    { text: '  active (running) · uptime 42d 06h', tone: 'text-[#8BE9A7]' },
  ];

  return (
    <div className={PANEL}>
      <PanelHeader label="bash · voip-server" />
      <div className="space-y-1 p-3 font-mono text-[0.55rem] leading-relaxed sm:p-4 sm:text-[0.68rem]">
        {lines.map((line) => (
          <p key={line.text} className={line.tone}>
            {line.text}
          </p>
        ))}
        <p className="text-[#D7E2EA]/70">
          <span className="mr-1 inline-block h-3 w-1.5 animate-pulse bg-[#B600A8] align-middle" />
        </p>
      </div>
    </div>
  );
}

function LogsVisual() {
  return (
    <div className={PANEL}>
      <PanelHeader label="journalctl · logs" accent="#8BE9A7" />
      <div className="space-y-2 p-3 font-mono text-[0.55rem] sm:p-4 sm:text-[0.66rem]">
        {[
          ['INFO', 'sip registration accepted 25 endpoints', 'text-[#8BE9A7]'],
          ['WARN', 'rtt spike on trunk 1 (72ms)', 'text-[#E0A458]'],
          ['INFO', 'firewall policy reloaded cleanly', 'text-[#8BE9A7]'],
          ['OK', 'service uptime 99.9% this month', 'text-[#BBCCD7]'],
        ].map(([level, message, tone]) => (
          <p key={message} className="flex gap-2">
            <span className={`shrink-0 ${tone}`}>{level}</span>
            <span className="text-[#D7E2EA]/70">{message}</span>
          </p>
        ))}
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <span className="accent-gradient block h-full w-[92%] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ChartVisual() {
  return (
    <div className={PANEL}>
      <PanelHeader label="uptime monitor" accent="#7621B0" />
      <div className="relative p-4">
        <p className="text-2xl font-black leading-none text-[#D7E2EA] sm:text-3xl">99.9%</p>
        <p className="mt-1 text-[0.55rem] font-light uppercase tracking-[0.24em] text-[#D7E2EA]/62 sm:text-[0.62rem]">
          telecom service uptime
        </p>
        <svg viewBox="0 0 220 90" className="mt-4 h-[110px] w-full" role="img" aria-label="Uptime trend">
          <defs>
            <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B600A8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#B600A8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[18, 38, 58, 78].map((y) => (
            <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="rgba(215,226,234,0.08)" strokeWidth="1" />
          ))}
          <path
            d="M0 62 L28 54 L56 58 L84 40 L112 44 L140 26 L168 30 L196 16 L220 20 L220 90 L0 90 Z"
            fill="url(#uptimeFill)"
          />
          <path
            d="M0 62 L28 54 L56 58 L84 40 L112 44 L140 26 L168 30 L196 16 L220 20"
            fill="none"
            stroke="#D7E2EA"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="196" cy="16" r="3.5" fill="#B600A8" />
        </svg>
      </div>
    </div>
  );
}

function TopologyVisual() {
  const nodes = [
    { x: 130, y: 24, label: 'Core Switch', color: '#D7E2EA' },
    { x: 44, y: 84, label: 'IP-PBX', color: '#B600A8' },
    { x: 130, y: 84, label: 'Softphone', color: '#BBCCD7' },
    { x: 216, y: 84, label: 'Firewall', color: '#E0A458' },
    { x: 44, y: 142, label: 'Floor 1', color: '#D7E2EA' },
    { x: 130, y: 142, label: 'Remote', color: '#D7E2EA' },
    { x: 216, y: 142, label: 'DHCP / DNS', color: '#D7E2EA' },
  ];
  const links: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [2, 5],
    [3, 6],
  ];

  return (
    <div className={PANEL}>
      <PanelHeader label="lan / wan topology" accent="#E0A458" />
      <svg viewBox="0 0 260 170" className="h-full w-full p-3" role="img" aria-label="Network topology">
        {links.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="rgba(215,226,234,0.28)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
        ))}
        {nodes.map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="5" fill={node.color} opacity="0.9" />
            <circle cx={node.x} cy={node.y} r="10" fill="none" stroke={node.color} strokeOpacity="0.18" />
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fill="rgba(215,226,234,0.7)"
              fontSize="9"
              fontFamily="monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DevicesVisual() {
  const endpoints = [
    { ext: '1001', status: 'Online', tone: 'text-[#8BE9A7]' },
    { ext: '1002', status: 'Online', tone: 'text-[#8BE9A7]' },
    { ext: '1003', status: 'Online', tone: 'text-[#8BE9A7]' },
    { ext: '1004', status: 'Registering', tone: 'text-[#E0A458]' },
    { ext: '1005', status: 'Online', tone: 'text-[#8BE9A7]' },
    { ext: '1006', status: 'Standby', tone: 'text-[#D7E2EA]/70' },
  ];

  return (
    <div className={PANEL}>
      <PanelHeader label="ip endpoints" accent="#8BE9A7" />
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.ext}
            className="rounded-xl border border-[#D7E2EA]/[0.12] bg-white/[0.03] px-2.5 py-3 text-center"
          >
            <span className="mx-auto mb-2 grid h-7 w-7 place-items-center rounded-lg border border-[#D7E2EA]/15 bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#D7E2EA" strokeWidth="1.8">
                <rect x="7" y="2.5" width="10" height="19" rx="2" />
                <path d="M10.5 18.5h3" />
              </svg>
            </span>
            <p className="text-[0.7rem] font-semibold text-[#D7E2EA]">Ext {endpoint.ext}</p>
            <p className={`text-[0.52rem] uppercase tracking-[0.16em] ${endpoint.tone}`}>{endpoint.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsoleVisual() {
  const rows = [
    { name: 'ad.helpdesk', group: 'Tier 1', scope: 'Reset + unlock', done: true },
    { name: 'voip.admin', group: 'Telephony', scope: 'Extensions', done: true },
    { name: 'net.ops', group: 'Infra', scope: 'Switch / DHCP', done: false },
    { name: 'lab.test', group: 'Home lab', scope: 'Firewall rules', done: false },
  ];

  return (
    <div className={PANEL}>
      <PanelHeader label="directory & ticketing" accent="#B600A8" />
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-2 border-b border-white/[0.07] pb-2 text-[0.5rem] uppercase tracking-[0.2em] text-[#D7E2EA]/60 sm:text-[0.56rem]">
          <span>Account</span>
          <span>Group</span>
          <span>Ticket SLA</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[1.2fr_0.9fr_0.9fr] items-center gap-2 border-b border-white/[0.05] py-2.5 text-[0.58rem] sm:text-[0.66rem]"
          >
            <span className="font-mono text-[#D7E2EA]/80">{row.name}</span>
            <span className="text-[#D7E2EA]/68">{row.group}</span>
            <span className="flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${row.done ? 'bg-[#8BE9A7]' : 'bg-[#E0A458]'}`}
                aria-hidden
              />
              <span className="text-[#D7E2EA]/65">{row.scope}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  switch (kind) {
    case 'terminal':
      return <TerminalVisual />;
    case 'logs':
      return <LogsVisual />;
    case 'chart':
      return <ChartVisual />;
    case 'topology':
      return <TopologyVisual />;
    case 'devices':
      return <DevicesVisual />;
    case 'console':
      return <ConsoleVisual />;
    default:
      return <TerminalVisual />;
  }
}
