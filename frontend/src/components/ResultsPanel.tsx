import { Activity, ArrowDown, ArrowUp, Gauge, Maximize2, Ratio, Target, Zap } from "lucide-react";
import type { HPHEResult } from "@/types/hphe";

interface Props {
  result: HPHEResult | null;
  loading: boolean;
}

interface Metric {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export function ResultsPanel({ result, loading }: Props) {
  const metrics: Metric[] = result
    ? [
        { label: "Heat transfer rate", value: `${result.heat_transfer_rate_kw.toFixed(2)} kW`, icon: <Zap size={16} />, accent: true },
        { label: "Effectiveness", value: `${(result.effectiveness * 100).toFixed(2)} %`, icon: <Target size={16} />, accent: true },
        { label: "Hot outlet", value: `${result.hot_outlet_temp.toFixed(2)} °C`, icon: <ArrowDown size={16} /> },
        { label: "Cold outlet", value: `${result.cold_outlet_temp.toFixed(2)} °C`, icon: <ArrowUp size={16} /> },
        { label: "Transfer area", value: `${result.heat_transfer_area_m2.toFixed(3)} m²`, icon: <Maximize2 size={16} /> },
        { label: "NTU", value: result.ntu.toFixed(4), icon: <Activity size={16} /> },
        { label: "Capacity ratio", value: result.capacity_ratio.toFixed(4), icon: <Ratio size={16} /> },
        { label: "Maximum heat transfer", value: `${result.q_max_kw.toFixed(2)} kW`, icon: <Gauge size={16} /> },
      ]
    : [];

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">Performance</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-800">Calculation Results</h2>
        </div>
        {result && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Calculated
          </span>
        )}
      </div>

      {!result ? (
        <div className="grid h-[76px] place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
          {loading ? "Running thermal model…" : "Run the calculation to view thermal performance."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className={`min-w-0 rounded-lg border px-3 py-2.5 ${metric.accent ? "border-teal-200 bg-teal-50/60" : "border-slate-100 bg-slate-50/70"}`}
            >
              <div className={`mb-1.5 ${metric.accent ? "text-teal-600" : "text-slate-400"}`}>{metric.icon}</div>
              <p className="min-h-6 text-[9px] font-bold uppercase leading-3 tracking-[0.06em] text-slate-400">{metric.label}</p>
              <p className="mt-0.5 whitespace-nowrap text-sm font-bold tabular-nums text-slate-800">{metric.value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
