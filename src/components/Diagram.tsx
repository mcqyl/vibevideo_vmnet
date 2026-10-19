import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { clamp01, ramp } from "../lib/anim";

/* ------------------------------------------------------------------ 布局 */
const VB = { w: 1600, h: 720 };

const HOST = { x: 100, y: 96, w: 960, h: 470 };
const VM = { x: 150, y: 270, w: 250, h: 160 };
const VNET = { x: 470, y: 270, w: 200, h: 160 };
const NIC = { x: 800, y: 280, w: 170, h: 140 };
const PILL = { cx: 735, cy: 330 };
const BUS = { x1: 1060, x2: 1260, y: 350 };
const ROUTER = { x: 1260, y: 270, w: 170, h: 160 };
const CLOUD = { cx: 1345, cy: 148, w: 214, h: 122 };

const CY = 350;

export type Mode = "bridge" | "nat" | "host";

type Pt = [number, number];

const IP = {
  bridge: { vm: "192.168.1.66", nic: "192.168.1.20", net: "192.168.1.0/24" },
  nat: { vm: "192.168.137.128", nic: "192.168.1.20", net: "192.168.1.0/24" },
  host: { vm: "192.168.163.128", nic: "192.168.1.20", net: "192.168.1.0/24" },
};

const VNET_NAME: Record<Mode, { name: string; sub: string }> = {
  bridge: { name: "VMnet0", sub: "桥接虚拟交换机" },
  nat: { name: "VMnet8", sub: "NAT 虚拟交换机" },
  host: { name: "VMnet1", sub: "仅主机虚拟交换机" },
};

/* ---------------------------------------------------------------- 几何工具 */
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const pointAt = (pts: Pt[], t: number): Pt => {
  const segs = pts.slice(1).map((p, i) => dist(pts[i], p));
  const total = segs.reduce((a, b) => a + b, 0);
  let target = clamp01(t) * total;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i] || i === segs.length - 1) {
      const r = segs[i] === 0 ? 0 : target / segs[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r,
      ];
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
};

/* ---------------------------------------------------------------- 图标 */
const Icon: React.FC<{ kind: "vm" | "switch" | "nic" | "router" | "cloud" | "host"; x: number; y: number; color: string; size?: number }> = ({
  kind,
  x,
  y,
  color,
  size = 30,
}) => {
  const s = size / 32;
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {kind === "vm" && (
        <>
          <rect x="2" y="4" width="28" height="20" rx="3" {...common} />
          <path d="M11 29h10M16 24v5" {...common} />
          <path d="M8 10h8M8 15h12" {...common} opacity={0.55} />
        </>
      )}
      {kind === "switch" && (
        <>
          <rect x="2" y="9" width="28" height="14" rx="3" {...common} />
          <rect x="6" y="13" width="4" height="3" fill={color} opacity={0.85} />
          <rect x="12" y="13" width="4" height="3" fill={color} opacity={0.6} />
          <rect x="18" y="13" width="4" height="3" fill={color} opacity={0.85} />
          <rect x="24" y="13" width="3" height="3" fill={color} opacity={0.5} />
          <path d="M6 18h20" stroke={color} strokeWidth="1.4" opacity={0.35} />
        </>
      )}
      {kind === "nic" && (
        <>
          <rect x="3" y="7" width="26" height="18" rx="2.5" {...common} />
          <rect x="8" y="12" width="10" height="8" rx="1.5" {...common} opacity={0.7} />
          <path d="M23 12v8M26 14v4" {...common} opacity={0.6} />
        </>
      )}
      {kind === "router" && (
        <>
          <rect x="2" y="13" width="28" height="13" rx="4" {...common} />
          <path d="M9 13V7M23 13V7M16 13V4" {...common} opacity={0.75} />
          <circle cx="9" cy="6" r="1.6" fill={color} />
          <circle cx="23" cy="6" r="1.6" fill={color} />
          <circle cx="16" cy="3.4" r="1.6" fill={color} />
          <path d="M7 20h6M17 20h8" stroke={color} strokeWidth="1.4" opacity={0.4} />
        </>
      )}
      {kind === "cloud" && (
        <path
          d="M9 23h15a5.5 5.5 0 0 0 .4-11 8 8 0 0 0-15.2 2.2A4.6 4.6 0 0 0 9 23Z"
          {...common}
        />
      )}
      {kind === "host" && (
        <>
          <rect x="3" y="6" width="26" height="17" rx="2.5" {...common} />
          <path d="M1 26h30" {...common} />
        </>
      )}
    </g>
  );
};

/* ---------------------------------------------------------------- 节点 */
const Node: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  title: string;
  sub?: string;
  icon: "vm" | "switch" | "nic" | "router" | "cloud" | "host";
  color: string;
  progress: number;
  dim?: boolean;
  pulse?: number;
}> = ({ box, title, sub, icon, color, progress, dim = false, pulse = 0 }) => {
  const p = clamp01(progress);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const scale = interpolate(p, [0, 1], [0.82, 1]);
  const stroke = dim ? "rgba(150,178,225,0.22)" : color;

  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
      opacity={p}
    >
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={20}
        fill={`url(#nodeFill)`}
        stroke={stroke}
        strokeWidth={dim ? 1.4 : 1.8}
        strokeOpacity={dim ? 0.6 : 0.55 + pulse * 0.45}
      />
      <rect
        x={box.x + 1}
        y={box.y + 1}
        width={box.w - 2}
        height={box.h - 2}
        rx={19}
        fill="none"
        stroke={color}
        strokeOpacity={0.12 + pulse * 0.3}
        strokeWidth={6}
      />
      <Icon kind={icon} x={box.x + 20} y={box.y + 18} color={dim ? "#7C8CA8" : color} size={30} />
      <text
        x={box.x + 20}
        y={box.y + 84}
        fill={dim ? "#8B9BB5" : C.ink}
        fontFamily={FONT_DISPLAY}
        fontSize={30}
        letterSpacing={0.5}
      >
        {title}
      </text>
      {sub && (
        <text
          x={box.x + 20}
          y={box.y + 112}
          fill={dim ? "#61718A" : "rgba(190,208,232,0.66)"}
          fontFamily={FONT_DISPLAY}
          fontSize={17}
          letterSpacing={0.6}
        >
          {sub}
        </text>
      )}
    </g>
  );
};

/* ---------------------------------------------------------------- IP 标签 */
const IpChip: React.FC<{ x: number; y: number; text: string; color: string; progress: number; dim?: boolean }> = ({
  x,
  y,
  text,
  color,
  progress,
  dim,
}) => {
  const w = 38 + text.length * 14.2;
  return (
    <g opacity={clamp01(progress)} transform={`translate(${x} ${y})`}>
      <rect
        width={w}
        height={36}
        rx={8}
        fill={dim ? "rgba(120,140,170,0.10)" : `${color}1F`}
        stroke={dim ? "rgba(140,165,200,0.25)" : `${color}66`}
        strokeWidth={1.2}
      />
      <text
        x={17}
        y={24}
        fill={dim ? "#7C8CA8" : color}
        fontFamily={FONT_NUM}
        fontSize={19}
        letterSpacing={1.3}
      >
        {text}
      </text>
    </g>
  );
};

/* ---------------------------------------------------------------- 连线 */
const Wire: React.FC<{
  pts: Pt[];
  color: string;
  progress: number;
  dashed?: boolean;
  width?: number;
  opacity?: number;
}> = ({ pts, color, progress, dashed = false, width = 2.4, opacity = 1 }) => {
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={dashed ? "0.012 0.014" : "1"}
      strokeDashoffset={dashed ? 0 : 1 - clamp01(progress)}
      opacity={opacity}
    />
  );
};

/* ---------------------------------------------------------------- 数据包 */
const Packet: React.FC<{
  pts: Pt[];
  t: number;
  color: string;
  size?: number;
  opacity?: number;
}> = ({ pts, t, color, size = 8, opacity = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  const trail = [0, 0.016, 0.032, 0.05];
  return (
    <g opacity={opacity}>
      {trail.map((off, i) => {
        const tt = clamp01(t - off);
        const [x, y] = pointAt(pts, tt);
        const r = size * (1 - i * 0.2);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            opacity={0.9 - i * 0.24}
            filter={i === 0 ? "url(#softGlow)" : undefined}
          />
        );
      })}
    </g>
  );
};

/* ---------------------------------------------------------------- 主图 */
export const NetworkDiagram: React.FC<{
  mode: Mode;
  accent: string;
  start?: number;
}> = ({ mode, accent, start = 0 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start);

  const ip = IP[mode];
  const vnet = VNET_NAME[mode];

  /* 入场节奏 */
  const hostIn = ramp(t, 0, 16);
  const vmIn = ramp(t, 6, 18);
  const vnetIn = ramp(t, 12, 18);
  const nicIn = ramp(t, 18, 18);
  const outIn = ramp(t, 24, 20);
  const wireIn = ramp(t, 30, 26);
  const ipIn = ramp(t, 52, 16);

  /* 数据流 */
  const flowOn = t > 66;
  const cycle = 78;
  const base = ((t - 66) / cycle) % 1;

  /* 各模式路径 */
  const vmOut: Pt = [VM.x + VM.w, CY];
  const vnetInPt: Pt = [VNET.x, CY];
  const vnetOut: Pt = [VNET.x + VNET.w, CY];
  const nicInPt: Pt = [NIC.x, CY];
  const nicOut: Pt = [NIC.x + NIC.w, CY];
  const hostEdge: Pt = [HOST.x + HOST.w, CY];
  const busEnd: Pt = [BUS.x2, CY];
  const routerC: Pt = [ROUTER.x + ROUTER.w / 2, CY];
  const cloudC: Pt = [CLOUD.cx, CLOUD.cy + CLOUD.h / 2];

  const fullPath: Pt[] = [vmOut, vnetInPt, vnetOut, nicInPt, nicOut, hostEdge, busEnd, routerC];
  const toCloud: Pt[] = [routerC, cloudC];

  const halfPath: Pt[] = [vmOut, vnetInPt, vnetOut];

  /* NAT：源地址改写时刻 */
  const NAT_AT = 0.5;
  const natActive = mode === "nat";
  const natHit = natActive ? ramp(t, 132, 18) : 0;
  const blocked = mode === "nat" ? ramp(t, 219, 14) : 0;
  const wallIn = mode === "host" ? ramp(t, 120, 20) : 0;

  const [pktX, pktY] = pointAt(mode === "host" ? halfPath : fullPath, base);
  const showPkt = flowOn && base > 0.02 && base < 0.96;

  /* 数据包当前源 IP */
  const srcIp =
    mode === "host"
      ? ip.vm
      : natActive
        ? base > NAT_AT
          ? ip.nic
          : ip.vm
        : ip.vm;

  const ipSwitch = natActive && Math.abs(base - NAT_AT) < 0.08;
  const rewritten = natActive && base > NAT_AT;

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} width="100%" height="100%">
      <defs>
        <linearGradient id="nodeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111C2E" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#0A1220" stopOpacity="0.96" />
        </linearGradient>
        <radialGradient id="cloudFill">
          <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.03" />
        </radialGradient>
        <filter id="softGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 宿主机容器 */}
      <g opacity={hostIn}>
        <rect
          x={HOST.x}
          y={HOST.y}
          width={HOST.w}
          height={HOST.h}
          rx={30}
          fill="rgba(20,32,52,0.35)"
          stroke="rgba(150,178,225,0.30)"
          strokeWidth={1.6}
          strokeDasharray="9 8"
        />
        <text
          x={HOST.x + 28}
          y={HOST.y + 40}
          fill="rgba(175,196,226,0.72)"
          fontFamily={FONT_DISPLAY}
          fontSize={20}
          letterSpacing={3}
        >
          宿主机 · HOST
        </text>
        <text
          x={HOST.x + HOST.w - 28}
          y={HOST.y + 40}
          textAnchor="end"
          fill="rgba(150,175,210,0.45)"
          fontFamily={FONT_NUM}
          fontSize={16}
          letterSpacing={2}
        >
          VMware Workstation
        </text>
      </g>

      {/* 虚拟机 */}
      <Node box={VM} title="虚拟机" sub="CentOS 7" icon="vm" color={accent} progress={vmIn} />
      {/* 虚拟交换机 */}
      <Node box={VNET} title={vnet.name} sub={vnet.sub} icon="switch" color={accent} progress={vnetIn} />
      {/* 物理网卡 */}
      <Node
        box={NIC}
        title="物理网卡"
        sub="Intel 82574L"
        icon="nic"
        color={mode === "host" ? "#7C8CA8" : accent}
        progress={nicIn}
        dim={mode === "host"}
      />

      {/* 外部网络 */}
      <g opacity={outIn}>
        <rect
          x={ROUTER.x}
          y={ROUTER.y}
          width={ROUTER.w}
          height={ROUTER.h}
          rx={20}
          fill="url(#nodeFill)"
          stroke="rgba(160,190,240,0.45)"
          strokeWidth={1.8}
        />
        <Icon kind="router" x={ROUTER.x + 20} y={ROUTER.y + 18} color="#BBD0EE" size={30} />
        <text
          x={ROUTER.x + 20}
          y={ROUTER.y + 82}
          fill={C.ink}
          fontFamily={FONT_DISPLAY}
          fontSize={30}
        >
          路由器
        </text>
        <text
          x={ROUTER.x + 20}
          y={ROUTER.y + 112}
          fill="rgba(190,208,232,0.66)"
          fontFamily={FONT_NUM}
          fontSize={17}
          letterSpacing={1.4}
        >
          192.168.1.1
        </text>

        <ellipse
          cx={CLOUD.cx}
          cy={CLOUD.cy}
          rx={CLOUD.w / 2}
          ry={CLOUD.h / 2}
          fill="url(#cloudFill)"
        />
        <Icon kind="cloud" x={CLOUD.cx - 52} y={CLOUD.cy - 16} color="#AFC6E8" size={34} />
        <text
          x={CLOUD.cx + 4}
          y={CLOUD.cy + 8}
          fill="rgba(215,228,248,0.9)"
          fontFamily={FONT_DISPLAY}
          fontSize={26}
          letterSpacing={1}
        >
          外网
        </text>
      </g>

      {/* 物理局域网总线 */}
      <g opacity={wireIn}>
        <Wire pts={[[BUS.x1, BUS.y], [BUS.x2, BUS.y]]} color="rgba(160,190,240,0.55)" progress={wireIn} width={3} />
        <text
          x={(BUS.x1 + BUS.x2) / 2}
          y={BUS.y - 18}
          textAnchor="middle"
          fill="rgba(160,185,220,0.6)"
          fontFamily={FONT_NUM}
          fontSize={15}
          letterSpacing={1.6}
        >
          物理局域网
        </text>
        <Wire pts={[[CLOUD.cx, CLOUD.cy + CLOUD.h / 2], [CLOUD.cx, ROUTER.y]]} color="rgba(160,190,240,0.45)" progress={wireIn} width={2.4} />
      </g>

      {/* 内部连线 */}
      <g>
        <Wire pts={[vmOut, vnetInPt]} color={accent} progress={wireIn} width={2.6} />
        <Wire
          pts={[vnetOut, nicInPt]}
          color={mode === "host" ? "rgba(150,178,225,0.35)" : accent}
          progress={wireIn}
          width={2.6}
          dashed={mode === "host"}
        />
        <Wire
          pts={[nicOut, hostEdge]}
          color={mode === "host" ? "rgba(150,178,225,0.18)" : accent}
          progress={wireIn}
          width={2.6}
        />
      </g>

      {/* 中间状态胶囊 */}
      {mode === "bridge" && (
        <g opacity={clamp01(ramp(t, 90, 16))}>
          <rect
            x={PILL.cx - 56}
            y={PILL.cy - 20}
            width={112}
            height={40}
            rx={20}
            fill={`${accent}22`}
            stroke={`${accent}88`}
            strokeWidth={1.4}
          />
          <text
            x={PILL.cx}
            y={PILL.cy + 7}
            textAnchor="middle"
            fill={accent}
            fontFamily={FONT_DISPLAY}
            fontSize={17}
            letterSpacing={2}
          >
            桥 接
          </text>
        </g>
      )}

      {mode === "nat" && (
        <g opacity={clamp01(ramp(t, 90, 16))}>
          <rect
            x={PILL.cx - 56}
            y={PILL.cy - 21}
            width={112}
            height={42}
            rx={22}
            fill={`${accent}22`}
            stroke={natHit > 0.1 ? accent : `${accent}88`}
            strokeWidth={1.4 + natHit * 1.4}
          />
          <text
            x={PILL.cx}
            y={PILL.cy + 8}
            textAnchor="middle"
            fill={accent}
            fontFamily={FONT_DISPLAY}
            fontSize={17}
            letterSpacing={1}
          >
            NAT 转换
          </text>
        </g>
      )}

      {/* 仅主机：隔离墙 */}
      {mode === "host" && (
        <g opacity={wallIn}>
          <line
            x1={PILL.cx}
            y1={236}
            x2={PILL.cx}
            y2={464}
            stroke={C.rose}
            strokeWidth={3}
            strokeDasharray="10 9"
            opacity={0.85}
          />
          <g transform={`translate(${PILL.cx} ${CY})`}>
            <circle r={26} fill="#1A0E14" stroke={C.rose} strokeWidth={2} />
            <path
              d="M-9 -9 L9 9 M9 -9 L-9 9"
              stroke={C.rose}
              strokeWidth={3.4}
              strokeLinecap="round"
            />
          </g>
          <text
            x={PILL.cx}
            y={492}
            textAnchor="middle"
            fill={C.rose}
            fontFamily={FONT_DISPLAY}
            fontSize={17}
            letterSpacing={2}
          >
            与外网隔离
          </text>
        </g>
      )}

      {/* IP 标签 */}
      <IpChip x={VM.x} y={VM.y + VM.h + 16} text={ip.vm} color={accent} progress={ipIn} />
      <IpChip
        x={NIC.x}
        y={NIC.y + NIC.h + 16}
        text={ip.nic}
        color={mode === "host" ? "#7C8CA8" : accent}
        progress={ipIn}
        dim={mode === "host"}
      />

      {/* 同网段提示（桥接） */}
      {mode === "bridge" && (
        <g opacity={clamp01(ramp(t, 112, 18))}>
          <path
            d={`M${VM.x + VM.w / 2} ${VM.y + VM.h + 62} L${VM.x + VM.w / 2} ${VM.y + VM.h + 78} L${NIC.x + NIC.w / 2} ${VM.y + VM.h + 78} L${NIC.x + NIC.w / 2} ${NIC.y + NIC.h + 62}`}
            fill="none"
            stroke={C.amber}
            strokeWidth={1.6}
            strokeDasharray="6 6"
            opacity={0.7}
          />
          <rect x={612} y={VM.y + VM.h + 62} width={146} height={32} rx={16} fill="#141008" stroke={`${C.amber}77`} strokeWidth={1.2} />
          <text
            x={685}
            y={VM.y + VM.h + 84}
            textAnchor="middle"
            fill={C.amber}
            fontFamily={FONT_DISPLAY}
            fontSize={16}
            letterSpacing={2}
          >
            同一网段
          </text>
        </g>
      )}

      {/* 数据包 */}
      {showPkt && (
        <Packet
          pts={mode === "host" ? halfPath : fullPath}
          t={base}
          color={mode === "host" ? C.lime : natActive && base > NAT_AT ? C.amber : accent}
          size={9}
        />
      )}

      {/* NAT 地址改写强调 */}
      {natActive && natHit > 0.02 && (
        <g opacity={natHit}>
          <circle cx={PILL.cx} cy={PILL.cy} r={34 + natHit * 18} fill="none" stroke={accent} strokeWidth={1.8} opacity={0.45} />
          <text
            x={PILL.cx}
            y={PILL.cy + 68}
            textAnchor="middle"
            fill={accent}
            fontFamily={FONT_DISPLAY}
            fontSize={17}
            letterSpacing={1}
          >
            源地址被改写
          </text>
        </g>
      )}

      {/* 外网无法主动连入 */}
      {natActive && blocked > 0.02 && (
        <g opacity={blocked}>
          <path
            d={`M${CLOUD.cx - 20} ${CLOUD.cy + CLOUD.h / 2} L${CLOUD.cx - 20} ${BUS.y} L${NIC.x + NIC.w} ${BUS.y} L${NIC.x + NIC.w} ${NIC.y + NIC.h / 2}`}
            fill="none"
            stroke={C.rose}
            strokeWidth={2.4}
            strokeDasharray="9 9"
            opacity={0.85}
          />
          <g transform={`translate(${NIC.x + NIC.w + 34} ${BUS.y})`}>
            <circle r={22} fill="#1A0E14" stroke={C.rose} strokeWidth={2} />
            <path d="M-8 -8 L8 8 M8 -8 L-8 8" stroke={C.rose} strokeWidth={3} strokeLinecap="round" />
          </g>
          <text
            x={NIC.x + NIC.w + 34}
            y={BUS.y - 40}
            textAnchor="middle"
            fill={C.rose}
            fontFamily={FONT_DISPLAY}
            fontSize={17}
            letterSpacing={1}
          >
            外网无法主动连入
          </text>
        </g>
      )}
      {/* 数据包 HUD */}
      <g opacity={clamp01(ramp(t, 60, 18))} transform="translate(100 596)">
        <rect
          width="600"
          height="66"
          rx="12"
          fill="rgba(8,13,22,0.86)"
          stroke={ipSwitch ? C.amber : "rgba(150,178,225,0.22)"}
          strokeWidth={ipSwitch ? 2 : 1.2}
        />
        <circle cx="30" cy="33" r={5.5} fill={mode === "host" ? C.lime : rewritten ? C.amber : accent} />
        <circle cx="30" cy="33" r="13" fill="none" stroke={mode === "host" ? C.lime : rewritten ? C.amber : accent} strokeWidth="1.2" opacity="0.4" />
        <text x="58" y="27" fill="rgba(150,175,210,0.62)" fontFamily={FONT_DISPLAY} fontSize="14" letterSpacing="2">
          数据包源 IP
        </text>
        <text
          x="58"
          y="52"
          fill={mode === "host" ? C.lime : rewritten ? C.amber : "rgba(225,238,252,0.95)"}
          fontFamily={FONT_NUM}
          fontSize="21"
          letterSpacing="1.4"
        >
          {srcIp}
        </text>
        <line x1="300" y1="18" x2="300" y2="48" stroke="rgba(150,178,225,0.16)" />
        <text x="326" y="27" fill="rgba(150,175,210,0.62)" fontFamily={FONT_DISPLAY} fontSize="14" letterSpacing="2">
          去向
        </text>
        <text
          x="326"
          y="52"
          fill={mode === "host" ? C.rose : "rgba(215,230,248,0.9)"}
          fontFamily={FONT_DISPLAY}
          fontSize="20"
          letterSpacing="1"
        >
          {mode === "host" ? "× 无出口（隔离）" : rewritten ? "→ 外网（地址已改写）" : "→ 外网"}
        </text>
      </g>
    </svg>
  );
};
