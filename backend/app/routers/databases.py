from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/databases", tags=["databases"])


@router.get("")
def list_databases():
    dbs = settings.databases()
    return {
        "default": settings.MONGO_DB,
        "available": [{"key": k, "name": v} for k, v in dbs.items()],
    }
