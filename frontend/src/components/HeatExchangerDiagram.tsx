import type { HPHEInput } from "@/types/hphe";

interface Props {
  inputs: HPHEInput;
}

export function HeatExchangerDiagram({ inputs }: Props) {
  const visiblePipes = Array.from({ length: 9 }, (_, index) => index);

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
      <div className="flex items-start justify-between px-5 pb-1 pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">System overview</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-800">HPHE Visualization</h2>
        </div>
        <div className="flex gap-4 text-[10px] font-semibold text-slate-500">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-hot" />Hot air</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-cold" />Cold air</span>
        </div>
      </div>

      <div className="px-3 pb-2">
        <svg viewBox="0 0 760 220" className="h-[185px] w-full" role="img" aria-label="Counterflow heat pipe heat exchanger schematic">
          <defs>
            <linearGradient id="shell" x1="0" x2="1">
              <stop offset="0" stopColor="#e8edf0" />
              <stop offset="0.5" stopColor="#f8fafb" />
              <stop offset="1" stopColor="#e5eaed" />
            </linearGradient>
            <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f28b55" />
              <stop offset="0.48" stopColor="#dccb9f" />
              <stop offset="0.52" stopColor="#9fc8dc" />
              <stop offset="1" stopColor="#3b88c8" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#1e293b" floodOpacity="0.14" />
            </filter>
            <marker id="arrowHot" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="#ef6a42" />
            </marker>
            <marker id="arrowCold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="#2f7edb" />
            </marker>
          </defs>

          <path d="M35 73 H174" stroke="#ef6a42" strokeWidth="30" strokeLinecap="round" opacity="0.12" />
          <path d="M46 73 H177" stroke="#ef6a42" strokeWidth="3" markerEnd="url(#arrowHot)" className="flow-hot" />
          <text x="35" y="45" fill="#a63f25" fontSize="12" fontWeight="700">HOT IN · {inputs.hot_inlet_temp}°C</text>

          <path d="M725 147 H586" stroke="#2f7edb" strokeWidth="30" strokeLinecap="round" opacity="0.12" />
          <path d="M714 147 H583" stroke="#2f7edb" strokeWidth="3" markerEnd="url(#arrowCold)" className="flow-cold" />
          <text x="626" y="181" fill="#2462a8" fontSize="12" fontWeight="700">COLD IN · {inputs.cold_inlet_temp}°C</text>

          <g filter="url(#shadow)">
            <rect x="175" y="26" width="410" height="168" rx="18" fill="url(#shell)" stroke="#aebbc2" strokeWidth="1.5" />
            <rect x="190" y="39" width="380" height="68" rx="10" fill="#fff1e9" />
            <rect x="190" y="113" width="380" height="68" rx="10" fill="#e8f3fc" />
            <path d="M190 110 H570" stroke="#9baab2" strokeWidth="6" />

            {visiblePipes.map((pipe) => {
              const x = 225 + pipe * 40;
              return (
                <g key={pipe}>
                  <ellipse cx={x} cy="48" rx="8" ry="4" fill="#f9b07e" />
                  <rect x={x - 8} y="48" width="16" height="124" fill="url(#pipe)" />
                  <ellipse cx={x} cy="172" rx="8" ry="4" fill="#2375b3" />
                  <path d={`M${x - 12} 66 H${x + 12} M${x - 12} 82 H${x + 12} M${x - 12} 138 H${x + 12} M${x - 12} 154 H${x + 12}`} stroke="#76878e" strokeWidth="2" opacity="0.55" />
                </g>
              );
            })}
          </g>

          <path d="M585 73 H710" stroke="#ef6a42" strokeWidth="3" markerEnd="url(#arrowHot)" className="flow-hot" />
          <path d="M175 147 H50" stroke="#2f7edb" strokeWidth="3" markerEnd="url(#arrowCold)" className="flow-cold" />

          <g fill="#64748b" fontSize="10" fontWeight="600">
            <text x="309" y="18">EVAPORATOR SECTION</text>
            <text x="310" y="215">CONDENSER SECTION</text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-slate-100 bg-slate-50/70 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        <span>{inputs.number_of_pipes} heat pipes</span>
        <span>{inputs.pipe_diameter_mm} mm OD</span>
        <span>{inputs.pipe_length_m} m length</span>
        <span>Counterflow model</span>
      </div>
    </section>
  );
}
