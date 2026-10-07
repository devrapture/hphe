"use client";

import { Flame, Snowflake, Waves } from "lucide-react";
import type { HPHEInput, HPHEInputDraft } from "@/types/hphe";

type NumericKey = keyof HPHEInput;

interface InputPanelProps {
  values: HPHEInputDraft;
  onChange: (key: NumericKey, value: string) => void;
  disabled?: boolean;
}

interface FieldProps {
  id: NumericKey;
  label: string;
  unit: string;
  value: string;
  step?: number;
  integer?: boolean;
  onChange: InputPanelProps["onChange"];
  disabled?: boolean;
}

function Field({ id, label, unit, value, step = 0.1, integer, onChange, disabled }: FieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.075em] text-slate-500">
        {label}
      </span>
      <span className="flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
        <input
          id={id}
          type="number"
          min={integer ? 1 : undefined}
          step={integer ? 1 : step}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(id, event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold tabular-nums text-slate-800 outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="border-l border-slate-200 px-2.5 text-[11px] font-medium text-slate-400">
          {unit}
        </span>
      </span>
    </label>
  );
}

function SectionTitle({ icon, title, tone }: { icon: React.ReactNode; title: string; tone: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`grid h-7 w-7 place-items-center rounded-md ${tone}`}>{icon}</span>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
  );
}

export function InputPanel({ values, onChange, disabled }: InputPanelProps) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Design inputs</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Set the operating point and core geometry.</p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-3 lg:grid-cols-1">
        <section>
          <SectionTitle
            icon={<Flame size={15} strokeWidth={2.2} />}
            title="Hot air"
            tone="bg-orange-50 text-hot"
          />
          <div className="grid gap-3">
            <Field id="hot_inlet_temp" label="Inlet temperature" unit="°C" value={values.hot_inlet_temp} onChange={onChange} disabled={disabled} />
            <Field id="hot_mass_flow" label="Mass flow rate" unit="kg/s" value={values.hot_mass_flow} onChange={onChange} disabled={disabled} />
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5 sm:border-l sm:border-t-0 sm:pl-5 lg:border-l-0 lg:border-t lg:pl-0">
          <SectionTitle
            icon={<Snowflake size={15} strokeWidth={2.2} />}
            title="Cold air"
            tone="bg-blue-50 text-cold"
          />
          <div className="grid gap-3">
            <Field id="cold_inlet_temp" label="Inlet temperature" unit="°C" value={values.cold_inlet_temp} onChange={onChange} disabled={disabled} />
            <Field id="cold_mass_flow" label="Mass flow rate" unit="kg/s" value={values.cold_mass_flow} onChange={onChange} disabled={disabled} />
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5 sm:border-l sm:border-t-0 sm:pl-5 lg:border-l-0 lg:border-t lg:pl-0">
          <SectionTitle
            icon={<Waves size={15} strokeWidth={2.2} />}
            title="Heat exchanger"
            tone="bg-teal-50 text-teal-600"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 lg:grid-cols-2">
            <Field id="number_of_pipes" label="Heat pipes" unit="qty" value={values.number_of_pipes} integer onChange={onChange} disabled={disabled} />
            <Field id="pipe_diameter_mm" label="Outer diameter" unit="mm" value={values.pipe_diameter_mm} onChange={onChange} disabled={disabled} />
            <Field id="pipe_length_m" label="Pipe length" unit="m" value={values.pipe_length_m} onChange={onChange} disabled={disabled} />
            <Field id="u_value" label="Overall U-value" unit="W/m²·K" value={values.u_value} onChange={onChange} disabled={disabled} />
          </div>
        </section>
      </div>
    </aside>
  );
}
