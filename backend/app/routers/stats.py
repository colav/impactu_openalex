from fastapi import APIRouter, Depends
from app.database import get_database

router = APIRouter(prefix="/stats", tags=["stats"])

COLLECTIONS = ["works", "authors", "institutions", "sources", "topics", "concepts", "funders", "publishers"]


@router.get("")
async def get_stats(db=Depends(get_database)):
    counts = {}
    for col in COLLECTIONS:
        counts[col] = await db[col].estimated_document_count()
    return counts
