import type { HPHEInput, HPHEResult } from "@/types/hphe";

interface ValidationIssue {
  loc?: Array<string | number>;
  msg?: string;
}

function errorMessage(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "detail" in payload
  ) {
    const detail = (payload as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((issue: ValidationIssue) => issue.msg ?? "Invalid input")
        .join(" ");
    }
  }
  return "The calculation could not be completed. Check the inputs and try again.";
}

export async function calculateHPHE(inputs: HPHEInput): Promise<HPHEResult> {
  let response: Response;

  try {
    response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
  } catch {
    throw new Error("Cannot reach the calculation service. Please try again shortly.");
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload as HPHEResult;
}
