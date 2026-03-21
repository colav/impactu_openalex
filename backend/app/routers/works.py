from fastapi import APIRouter, Depends, Query
from app.database import get_database
from app.utils import build_text_filter, clean_doc, paginate_params, openalex_id_filter

router = APIRouter(prefix="/works", tags=["works"])


@router.get("")
async def list_works(
    q: str | None = Query(None, description="Search by title or abstract"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    type: str | None = None,
    year: int | None = None,
    is_oa: bool | None = None,
    db=Depends(get_database),
):
    filt: dict = {}
    if q:
        filt.update(
            build_text_filter(q, ["title", "display_name", "abstract"])
        )
    if type:
        filt["type"] = type
    if year:
        filt["publication_year"] = year
    if is_oa is not None:
        filt["open_access.is_oa"] = is_oa

    skip, limit = paginate_params(page, per_page)
    collection = db["works"]

    total = await collection.count_documents(filt)
    cursor = collection.find(filt).skip(skip).limit(limit).sort("publication_year", -1)
    docs = [clean_doc(d) async for d in cursor]

    return {"meta": {"count": total, "page": page, "per_page": per_page}, "results": docs}


@router.get("/{work_id}")
async def get_work(work_id: str, db=Depends(get_database)):
    collection = db["works"]
    doc = await collection.find_one(openalex_id_filter(work_id))
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Work not found")
    return clean_doc(doc)
