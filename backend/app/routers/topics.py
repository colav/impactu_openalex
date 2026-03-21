from fastapi import APIRouter, Depends, Query, HTTPException
from app.database import get_database
from app.utils import build_search_filter, clean_doc, paginate_params, openalex_id_filter

router = APIRouter(prefix="/topics", tags=["topics"])


@router.get("")
async def list_topics(
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db=Depends(get_database),
):
    filt = build_search_filter(q, ["display_name"])
    skip, limit = paginate_params(page, per_page)
    collection = db["topics"]

    total = await collection.count_documents(filt)
    cursor = collection.find(filt).skip(skip).limit(limit)
    docs = [clean_doc(d) async for d in cursor]
    return {"meta": {"count": total, "page": page, "per_page": per_page}, "results": docs}


@router.get("/{topic_id}")
async def get_topic(topic_id: str, db=Depends(get_database)):
    collection = db["topics"]
    doc = await collection.find_one(openalex_id_filter(topic_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Topic not found")
    return clean_doc(doc)
