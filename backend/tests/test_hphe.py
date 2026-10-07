"""Tests for the HPHE engineering engine."""

import math

import pytest
from pydantic import ValidationError

from app.engineering.hphe import CP_AIR_J_PER_KG_K, calculate_hphe
from app.schemas import HPHEInput


def make_inputs(**overrides: float) -> HPHEInput:
    values = {
        "hot_inlet_temp": 120.0,
        "cold_inlet_temp": 30.0,
        "hot_mass_flow": 2.5,
        "cold_mass_flow": 3.0,
        "number_of_pipes": 40,
        "pipe_diameter_mm": 25.0,
        "pipe_length_m": 1.2,
        "u_value": 60.0,
    }
    values.update(overrides)
    return HPHEInput(**values)


def test_normal_calculation() -> None:
    result = calculate_hphe(make_inputs())

    expected_area = 40 * math.pi * 0.025 * 1.2
    assert result.heat_transfer_area_m2 == pytest.approx(expected_area)
    assert result.hot_capacity_rate_w_per_k == pytest.approx(2.5 * CP_AIR_J_PER_KG_K)
    assert result.cold_capacity_rate_w_per_k == pytest.approx(3.0 * CP_AIR_J_PER_KG_K)
    assert result.capacity_ratio == pytest.approx(2.5 / 3.0)
    assert result.heat_transfer_rate_kw == pytest.approx(18.8053, rel=1e-4)


def test_equal_capacity_rates_use_unity_ratio_equation() -> None:
    inputs = make_inputs(hot_mass_flow=2.5, cold_mass_flow=2.5)
    result = calculate_hphe(inputs)

    assert result.capacity_ratio == pytest.approx(1.0)
    assert result.effectiveness == pytest.approx(result.ntu / (1.0 + result.ntu))


def test_zero_mass_flow_is_rejected() -> None:
    with pytest.raises(ValidationError, match="greater than 0"):
        make_inputs(hot_mass_flow=0)


def test_negative_pipe_diameter_is_rejected() -> None:
    with pytest.raises(ValidationError, match="greater than 0"):
        make_inputs(pipe_diameter_mm=-25)


def test_hot_temperature_below_cold_temperature_is_rejected() -> None:
    with pytest.raises(ValidationError, match="Hot inlet temperature"):
        make_inputs(hot_inlet_temp=20, cold_inlet_temp=30)


def test_doubling_pipe_count_doubles_area() -> None:
    base = calculate_hphe(make_inputs(number_of_pipes=40))
    doubled = calculate_hphe(make_inputs(number_of_pipes=80))

    assert doubled.heat_transfer_area_m2 == pytest.approx(
        2 * base.heat_transfer_area_m2
    )


def test_more_area_increases_effectiveness() -> None:
    smaller = calculate_hphe(make_inputs(number_of_pipes=20))
    larger = calculate_hphe(make_inputs(number_of_pipes=80))

    assert larger.effectiveness > smaller.effectiveness


def test_outlet_temperatures_are_physically_sensible() -> None:
    inputs = make_inputs()
    result = calculate_hphe(inputs)

    assert inputs.cold_inlet_temp < result.cold_outlet_temp < result.hot_outlet_temp
    assert result.hot_outlet_temp < inputs.hot_inlet_temp
    assert 0 <= result.effectiveness <= 1
