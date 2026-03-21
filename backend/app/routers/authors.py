from fastapi import APIRouter, Depends, Query, HTTPException
from app.database import get_database
from app.utils import build_search_filter, clean_doc, paginate_params, openalex_id_filter

router = APIRouter(prefix="/authors", tags=["authors"])


@router.get("")
async def list_authors(
    q: str | None = Query(None, description="Search by name"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db=Depends(get_database),
):
    filt = build_search_filter(q, ["display_name"])
    skip, limit = paginate_params(page, per_page)
    collection = db["authors"]

    total = await collection.count_documents(filt)
    cursor = (
        collection.find(filt)
        .skip(skip)
        .limit(limit)
        .sort("cited_by_count", -1)
    )
    docs = [clean_doc(d) async for d in cursor]
    return {"meta": {"count": total, "page": page, "per_page": per_page}, "results": docs}


@router.get("/{author_id}")
async def get_author(author_id: str, db=Depends(get_database)):
    collection = db["authors"]
    doc = await collection.find_one(openalex_id_filter(author_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Author not found")
    return clean_doc(doc)
