interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
}

export type IconName =
  | 'home'
  | 'calendar'
  | 'book'
  | 'person'
  | 'clock'
  | 'template'
  | 'chart'
  | 'star'
  | 'fire'
  | 'export'
  | 'import'
  | 'plus'
  | 'check'
  | 'dumbbell'
  | 'body'
  | 'goal'
  | 'recent'
  | 'recommend'
  | 'circle'
  | 'triangle'
  | 'square'
  | 'diamond'
  | 'hexagon'
  | 'cross'
  | 'moon'
  | 'trophy'
  | 'crown'
  | 'target'
  | 'settings'
  | 'chevron-right'
  | 'construction'
  | 'menu';

const paths: Record<IconName, { d: string; stroke?: string; fill?: string }[]> = {
  home: [
    { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { d: 'M9 22V12h6v10' },
  ],
  calendar: [
    { d: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z' },
    { d: 'M16 2v4M8 2v4M3 10h18' },
  ],
  book: [
    { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' },
    { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
    { d: 'M12 6v12' },
  ],
  person: [
    { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    { d: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' },
  ],
  clock: [
    { d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
    { d: 'M12 6v6l4 2' },
  ],
  template: [
    { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { d: 'M14 2v6h6M16 13H8M16 17H8M10 9H8' },
  ],
  chart: [
    { d: 'M18 20V10M12 20V4M6 20v-4' },
  ],
  star: [
    { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  fire: [
    { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12q0-1-3-5-3 4-3 5a2.5 2.5 0 1 0 5 0Q7 12 8.5 14.5z' },
    { d: 'M14 2c-1.5 2-2 4-2 6s.5 3.5 2 5c2-1 4-3.5 4-7S18 2 14 2z' },
    { d: 'M10 18c-2 1-3.5 2-3.5 4S8.5 24 12 24s5.5-1 5.5-3S16 18 14 17c0 1-2 2-2 2s-2 0-2-1z' },
  ],
  export: [
    { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
    { d: 'M17 8l-5-5-5 5M12 3v12' },
  ],
  import: [
    { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
    { d: 'M7 10l5 5 5-5M12 15V3' },
  ],
  plus: [
    { d: 'M12 5v14M5 12h14' },
  ],
  check: [
    { d: 'M20 6L9 17l-5-5' },
  ],
  dumbbell: [
    { d: 'M6.5 6.5h2v11h-2zM15.5 6.5h2v11h-2z' },
    { d: 'M8.5 8.5h7v7h-7z' },
    { d: 'M4 9.5h2.5v5H4zM17.5 9.5H20v5h-2.5z' },
  ],
  body: [
    { d: 'M12 20v-7M9 20v-7M15 20v-7' },
    { d: 'M4 20h16' },
    { d: 'M12 13V7.5a2.5 2.5 0 0 1 5 0V13' },
  ],
  goal: [
    { d: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  ],
  recent: [
    { d: 'M22 12h-6l-2 4-4-8-2 4H2' },
  ],
  recommend: [
    { d: 'M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8L8.4 14l-6-4.8h7.6z' },
  ],
  circle: [
    { d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
  ],
  triangle: [
    { d: 'M12 3l9 17H3z' },
  ],
  square: [
    { d: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z' },
  ],
  diamond: [
    { d: 'M12 2l10 10-10 10L2 12z' },
  ],
  hexagon: [
    { d: 'M12 2l9 5v10l-9 5-9-5V7z' },
  ],
  cross: [
    { d: 'M12 2v20M2 12h20' },
  ],
  moon: [
    { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' },
  ],
  trophy: [
    { d: 'M6 9H4.5A2.5 2.5 0 0 1 2 6.5C2 5 4 4 6 4h3' },
    { d: 'M18 9h1.5A2.5 2.5 0 0 0 22 6.5C22 5 20 4 18 4h-3' },
    { d: 'M6 4h12v4a6 6 0 0 1-12 0V4z' },
    { d: 'M12 14v7M8 21h8' },
  ],
  crown: [
    { d: 'M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z' },
    { d: 'M2 17h20v3H2z' },
  ],
  target: [
    { d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
    { d: 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z' },
    { d: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  ],
  settings: [
    { d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ],
  'chevron-right': [
    { d: 'M9 18l6-6-6-6' },
  ],
  construction: [
    { d: 'M18 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z' },
    { d: 'M10 11h4v4h-4z' },
    { d: 'M9 9h.01M15 9h.01M9 15h.01' },
  ],
  menu: [
    { d: 'M3 6h18M3 12h18M3 18h18' },
  ],
};

export default function Icon({ name, size = 24, className = '', filled = false }: IconProps) {
  const shapes = paths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {shapes.map((shape, i) => {
        const fillMode = filled && i === 0 ? 'currentColor' : 'none';
        const fillOpacity = filled && i === 0 ? 0.35 : undefined;
        return (
          <path
            key={i}
            d={shape.d}
            fill={fillMode}
            fillOpacity={fillOpacity}
            stroke={shape.stroke || 'currentColor'}
          />
        );
      })}
    </svg>
  );
}
