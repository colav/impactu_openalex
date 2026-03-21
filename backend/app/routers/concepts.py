from fastapi import APIRouter, Depends, Query, HTTPException
from app.database import get_database
from app.utils import build_text_filter, clean_doc, paginate_params, openalex_id_filter

router = APIRouter(prefix="/concepts", tags=["concepts"])


@router.get("")
async def list_concepts(
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    level: int | None = None,
    db=Depends(get_database),
):
    filt = build_text_filter(q, ["display_name"])
    if level is not None:
        filt["level"] = level

    skip, limit = paginate_params(page, per_page)
    collection = db["concepts"]

    total = await collection.count_documents(filt)
    cursor = (
        collection.find(filt)
        .skip(skip)
        .limit(limit)
        .sort("works_count", -1)
    )
    docs = [clean_doc(d) async for d in cursor]
    return {"meta": {"count": total, "page": page, "per_page": per_page}, "results": docs}


@router.get("/{concept_id}")
async def get_concept(concept_id: str, db=Depends(get_database)):
    collection = db["concepts"]
    doc = await collection.find_one(openalex_id_filter(concept_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Concept not found")
    return clean_doc(doc)
