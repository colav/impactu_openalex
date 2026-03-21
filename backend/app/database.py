import logging
from fastapi import Query
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger(__name__)
client: AsyncIOMotorClient = None


def get_database(db: str | None = Query(None, description="Database key (see /api/databases)")):
    """FastAPI dependency: returns the Motor database for the requested key.

    Falls back to the default MONGO_DB when *db* is absent or unknown.
    """
    if db and db in settings.databases():
        return client[db]
    return client[settings.MONGO_DB]


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    # Ensure indexes exist (idempotent)
    from app.indexes import ensure_indexes
    db = client[settings.MONGO_DB]
    try:
        await ensure_indexes(db)
    except Exception as exc:
        logger.warning("Index creation warning: %s", exc)


async def close_db():
    global client
    if client:
        client.close()
