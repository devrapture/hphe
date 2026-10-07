"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HPHEInput, HPHEResult } from "@/types/hphe";

interface Props {
  inputs: HPHEInput;
  result: HPHEResult | null;
}

export function TemperatureChart({ inputs, result }: Props) {
  const data = result
    ? Array.from({ length: 20 }, (_, index) => {
        const fraction = index / 19;
        return {
          length: Number((inputs.pipe_length_m * fraction).toFixed(3)),
          hot: inputs.hot_inlet_temp + (result.hot_outlet_temp - inputs.hot_inlet_temp) * fraction,
          cold: inputs.cold_inlet_temp + (result.cold_outlet_temp - inputs.cold_inlet_temp) * fraction,
        };
      })
    : [];

  return (
    <section className="min-h-[235px] rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-panel">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">Thermal gradient</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-800">Temperature Profile</h2>
        </div>
        <p className="hidden text-[10px] text-slate-400 sm:block">Interpolated for visualization</p>
      </div>

      {!result ? (
        <div className="grid h-[178px] place-items-center rounded-lg bg-slate-50 text-xs text-slate-400">
          Temperature curves will appear here after calculation.
        </div>
      ) : (
        <div className="h-[178px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 14, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 5" stroke="#e7ecef" vertical={false} />
              <XAxis
                dataKey="length"
                type="number"
                domain={[0, inputs.pipe_length_m]}
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                label={{ value: "Heat exchanger length (m)", position: "insideBottom", offset: -1, fontSize: 9, fill: "#94a3b8" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={45}
                unit="°"
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toFixed(2)} °C`, name]}
                labelFormatter={(value) => `Length: ${Number(value).toFixed(2)} m`}
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 11, boxShadow: "0 8px 24px rgba(15, 23, 42, .08)" }}
              />
              <Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ fontSize: 10, paddingBottom: 5 }} />
              <Line name="Hot Air" type="monotone" dataKey="hot" stroke="#ef6a42" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Line name="Cold Air" type="monotone" dataKey="cold" stroke="#2f7edb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
