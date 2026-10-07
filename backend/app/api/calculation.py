"""Calculation API routes."""

from fastapi import APIRouter

from app.engineering.hphe import calculate_hphe
from app.schemas import HPHEInput, HPHEResult


router = APIRouter(tags=["calculation"])


@router.post("/calculate", response_model=HPHEResult)
def calculate(inputs: HPHEInput) -> HPHEResult:
    """Return thermal performance for the supplied HPHE operating point."""

    return calculate_hphe(inputs)
