"use client";

import { useState } from "react";
import { AlertCircle, Calculator, RotateCcw } from "lucide-react";
import { Assumptions } from "@/components/Assumptions";
import { HeatExchangerDiagram } from "@/components/HeatExchangerDiagram";
import { InputPanel } from "@/components/InputPanel";
import { ResultsPanel } from "@/components/ResultsPanel";
import { TemperatureChart } from "@/components/TemperatureChart";
import { calculateHPHE } from "@/lib/api";
import { DEFAULT_INPUTS, type HPHEInput, type HPHEResult } from "@/types/hphe";

export default function Home() {
  const [inputs, setInputs] = useState<HPHEInput>(DEFAULT_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<HPHEInput>(DEFAULT_INPUTS);
  const [result, setResult] = useState<HPHEResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateInput(key: keyof HPHEInput, value: number) {
    setInputs((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function runCalculation() {
    setLoading(true);
    setError(null);
    try {
      const nextResult = await calculateHPHE(inputs);
      setResult(nextResult);
      setCalculatedInputs({ ...inputs });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Calculation failed.");
    } finally {
      setLoading(false);
    }
  }

  function resetInputs() {
    setInputs({ ...DEFAULT_INPUTS });
    setResult(null);
    setError(null);
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:px-7">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 shadow-sm">
              <svg viewBox="0 0 30 30" className="h-6 w-6" aria-hidden="true">
                <path d="M5 8h20M5 15h20M5 22h20" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
                <path d="M10 5v20M20 5v20" stroke="#31c7b0" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900">HPHE Designer</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Engineering Demo / MVP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetInputs}
              disabled={loading}
              className="hidden h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 sm:flex"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              type="button"
              onClick={runCalculation}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-lg bg-teal-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              <Calculator size={15} /> {loading ? "Calculating…" : "Run Calculation"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
        <InputPanel values={inputs} onChange={updateInput} disabled={loading} />

        <div className="min-w-0 p-4 lg:p-5">
          {error && (
            <div role="alert" className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
              <AlertCircle size={15} className="mt-px shrink-0" /> {error}
            </div>
          )}

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,.85fr)]">
            <HeatExchangerDiagram inputs={inputs} />
            <TemperatureChart inputs={calculatedInputs} result={result} />
            <div className="xl:col-span-2">
              <ResultsPanel result={result} loading={loading} />
            </div>
            <div className="xl:col-span-2">
              <Assumptions />
            </div>
          </div>

          <footer className="flex items-center justify-between px-1 py-3 text-[10px] text-slate-400">
            <span>Idealized counterflow ε-NTU model</span>
            <span>Not a certified design package</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
