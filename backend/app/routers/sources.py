from fastapi import APIRouter, Depends, Query, HTTPException
from app.database import get_database
from app.utils import build_search_filter, clean_doc, paginate_params, openalex_id_filter

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("")
async def list_sources(
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    is_oa: bool | None = None,
    type: str | None = None,
    db=Depends(get_database),
):
    filt = build_search_filter(q, ["display_name"])
    if is_oa is not None:
        filt["is_oa"] = is_oa
    if type:
        filt["type"] = type

    skip, limit = paginate_params(page, per_page)
    collection = db["sources"]

    total = await collection.count_documents(filt)
    cursor = (
        collection.find(filt)
        .skip(skip)
        .limit(limit)
        .sort("works_count", -1)
    )
    docs = [clean_doc(d) async for d in cursor]
    return {"meta": {"count": total, "page": page, "per_page": per_page}, "results": docs}


@router.get("/{source_id}")
async def get_source(source_id: str, db=Depends(get_database)):
    collection = db["sources"]
    doc = await collection.find_one(openalex_id_filter(source_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Source not found")
    return clean_doc(doc)
