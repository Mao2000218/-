interface LineChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}

export function LineChart({ data, labels, color = '#f97316', height = 160 }: LineChartProps) {
  const max = Math.max(...data, 1);
  const w = 320;
  const h = height;
  const pad = 20;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;

  const points = data
    .map((v, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = pad + chartH - (v / max) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = pad + chartH - ratio * chartH;
        return (
          <g key={ratio}>
            <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#2a2a2a" strokeWidth="0.5" />
            {ratio > 0 && (
              <text x={pad - 4} y={y + 4} fill="#555" fontSize="8" textAnchor="end">
                {Math.round(max * ratio)}
              </text>
            )}
          </g>
        );
      })}
      {/* Area */}
      {data.length > 1 && (
        <polygon
          points={`${pad},${pad + chartH} ${points} ${w - pad},${pad + chartH}`}
          fill={color}
          fillOpacity="0.1"
        />
      )}
      {/* Line */}
      {data.length > 0 && (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* Dots */}
      {data.map((v, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * chartW;
        const y = pad + chartH - (v / max) * chartH;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
      {/* Labels */}
      {labels.map((l, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * chartW;
        return (
          <text key={i} x={x} y={h - 2} fill="#555" fontSize="8" textAnchor="middle">
            {l}
          </text>
        );
      })}
    </svg>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}

const SEGMENT_COLORS = ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#c2410c', '#7c2d12', '#9a3412'];

export function DonutChart({ segments, size = 140 }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = size / 2 - 12;
  const circumference = 2 * Math.PI * r;

  let offset = 0;

  const colored = segments.map((s, i) => ({
    ...s,
    color: s.color || SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0">
        {colored.map((seg) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const strokeDasharray = `${dash} ${circumference - dash}`;
          const strokeDashoffset = -offset;
          const circle = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
          offset += dash;
          return circle;
        })}
        <text x={size / 2} y={size / 2} fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" dy="5">
          {total}
        </text>
      </svg>
      <div className="space-y-1.5">
        {colored.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-400">{seg.label}</span>
            <span className="text-gray-300 font-medium">{seg.value}次</span>
          </div>
        ))}
      </div>
    </div>
  );
}
