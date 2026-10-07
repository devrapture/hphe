export interface HPHEInput {
  hot_inlet_temp: number;
  cold_inlet_temp: number;
  hot_mass_flow: number;
  cold_mass_flow: number;
  number_of_pipes: number;
  pipe_diameter_mm: number;
  pipe_length_m: number;
  u_value: number;
}

export type HPHEInputDraft = {
  [Key in keyof HPHEInput]: string;
};

export interface HPHEResult {
  heat_transfer_area_m2: number;
  hot_capacity_rate_w_per_k: number;
  cold_capacity_rate_w_per_k: number;
  c_min_w_per_k: number;
  c_max_w_per_k: number;
  capacity_ratio: number;
  ntu: number;
  effectiveness: number;
  q_max_kw: number;
  heat_transfer_rate_kw: number;
  hot_outlet_temp: number;
  cold_outlet_temp: number;
}

export const DEFAULT_INPUTS: HPHEInput = {
  hot_inlet_temp: 120,
  cold_inlet_temp: 30,
  hot_mass_flow: 2.5,
  cold_mass_flow: 3.0,
  number_of_pipes: 40,
  pipe_diameter_mm: 25,
  pipe_length_m: 1.2,
  u_value: 60,
};

export function toInputDraft(inputs: HPHEInput): HPHEInputDraft {
  return {
    hot_inlet_temp: String(inputs.hot_inlet_temp),
    cold_inlet_temp: String(inputs.cold_inlet_temp),
    hot_mass_flow: String(inputs.hot_mass_flow),
    cold_mass_flow: String(inputs.cold_mass_flow),
    number_of_pipes: String(inputs.number_of_pipes),
    pipe_diameter_mm: String(inputs.pipe_diameter_mm),
    pipe_length_m: String(inputs.pipe_length_m),
    u_value: String(inputs.u_value),
  };
}
