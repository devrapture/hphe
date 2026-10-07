import { ChevronDown, Info } from "lucide-react";

const assumptions = [
  "Steady-state operation",
  "Constant air specific heat: 1005 J/kg·K",
  "Constant overall heat-transfer coefficient",
  "No heat loss to the environment",
  "Uniform heat-pipe geometry",
  "Idealized ε-NTU heat exchanger model",
  "No pressure-drop calculation",
  "No detailed heat-pipe operating-limit analysis",
  "No phase-change fluid-property model",
];

export function Assumptions() {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3">
        <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Info size={14} className="text-teal-600" /> Demo assumptions
          <span className="font-normal text-slate-400">· Cp air = 1005 J/kg·K</span>
        </span>
        <ChevronDown size={15} className="text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 px-5 py-3">
        <ul className="grid gap-x-8 gap-y-1 text-[11px] leading-5 text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
          {assumptions.map((assumption) => (
            <li key={assumption} className="before:mr-2 before:text-teal-500 before:content-['•']">{assumption}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}
