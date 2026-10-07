"""Request and response models for the HPHE calculation API."""

from pydantic import BaseModel, ConfigDict, Field, model_validator


class HPHEInput(BaseModel):
    """Validated operating conditions and heat exchanger geometry."""

    model_config = ConfigDict(extra="forbid")

    hot_inlet_temp: float = Field(..., description="Hot-air inlet temperature in °C")
    cold_inlet_temp: float = Field(..., description="Cold-air inlet temperature in °C")
    hot_mass_flow: float = Field(..., gt=0, description="Hot-air mass flow rate in kg/s")
    cold_mass_flow: float = Field(..., gt=0, description="Cold-air mass flow rate in kg/s")
    number_of_pipes: int = Field(..., gt=0, description="Number of heat pipes")
    pipe_diameter_mm: float = Field(..., gt=0, description="Pipe outer diameter in mm")
    pipe_length_m: float = Field(..., gt=0, description="Pipe length in m")
    u_value: float = Field(..., gt=0, description="Overall heat-transfer coefficient in W/m²·K")

    @model_validator(mode="after")
    def validate_temperature_order(self) -> "HPHEInput":
        if self.hot_inlet_temp <= self.cold_inlet_temp:
            raise ValueError(
                "Hot inlet temperature must be greater than cold inlet temperature."
            )
        return self


class HPHEResult(BaseModel):
    """Thermal performance outputs from the effectiveness-NTU calculation."""

    heat_transfer_area_m2: float
    hot_capacity_rate_w_per_k: float
    cold_capacity_rate_w_per_k: float
    c_min_w_per_k: float
    c_max_w_per_k: float
    capacity_ratio: float
    ntu: float
    effectiveness: float
    q_max_kw: float
    heat_transfer_rate_kw: float
    hot_outlet_temp: float
    cold_outlet_temp: float
