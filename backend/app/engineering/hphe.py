"""Thermal model for a simple heat pipe heat exchanger.

The MVP treats the exchanger as an idealized counterflow heat exchanger and
uses a constant air specific heat. The module deliberately has no knowledge of
HTTP so it can be tested and reused independently of FastAPI.
"""

import math

from app.schemas import HPHEInput, HPHEResult


CP_AIR_J_PER_KG_K = 1005.0
UNITY_CAPACITY_RATIO_TOLERANCE = 1e-9


def calculate_hphe(inputs: HPHEInput) -> HPHEResult:
    """Calculate HPHE performance with the counterflow effectiveness-NTU method."""

    diameter_m = inputs.pipe_diameter_mm / 1000.0
    heat_transfer_area = (
        inputs.number_of_pipes * math.pi * diameter_m * inputs.pipe_length_m
    )

    c_hot = inputs.hot_mass_flow * CP_AIR_J_PER_KG_K
    c_cold = inputs.cold_mass_flow * CP_AIR_J_PER_KG_K
    c_min = min(c_hot, c_cold)
    c_max = max(c_hot, c_cold)
    capacity_ratio = c_min / c_max

    ua = inputs.u_value * heat_transfer_area
    ntu = ua / c_min

    if math.isclose(
        capacity_ratio,
        1.0,
        rel_tol=UNITY_CAPACITY_RATIO_TOLERANCE,
        abs_tol=UNITY_CAPACITY_RATIO_TOLERANCE,
    ):
        effectiveness = ntu / (1.0 + ntu)
    else:
        exponential_term = math.exp(-ntu * (1.0 - capacity_ratio))
        effectiveness = (1.0 - exponential_term) / (
            1.0 - capacity_ratio * exponential_term
        )

    temperature_difference = inputs.hot_inlet_temp - inputs.cold_inlet_temp
    q_max_w = c_min * temperature_difference
    heat_transfer_rate_w = effectiveness * q_max_w

    hot_outlet_temp = inputs.hot_inlet_temp - heat_transfer_rate_w / c_hot
    cold_outlet_temp = inputs.cold_inlet_temp + heat_transfer_rate_w / c_cold

    return HPHEResult(
        heat_transfer_area_m2=heat_transfer_area,
        hot_capacity_rate_w_per_k=c_hot,
        cold_capacity_rate_w_per_k=c_cold,
        c_min_w_per_k=c_min,
        c_max_w_per_k=c_max,
        capacity_ratio=capacity_ratio,
        ntu=ntu,
        effectiveness=effectiveness,
        q_max_kw=q_max_w / 1000.0,
        heat_transfer_rate_kw=heat_transfer_rate_w / 1000.0,
        hot_outlet_temp=hot_outlet_temp,
        cold_outlet_temp=cold_outlet_temp,
    )
