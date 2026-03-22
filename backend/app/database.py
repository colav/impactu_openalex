import asyncio
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


async def _create_indexes_background():
    """Create indexes for all configured databases without blocking startup."""
    from app.indexes import ensure_indexes
    for db_key in settings.databases():
        try:
            logger.info("Ensuring indexes for database: %s", db_key)
            await ensure_indexes(client[db_key])
            logger.info("Indexes ready for database: %s", db_key)
        except Exception as exc:
            logger.warning("Index creation warning on %s: %s", db_key, exc)


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    # Run index creation in background so startup is not blocked
    asyncio.create_task(_create_indexes_background())


async def close_db():
    global client
    if client:
        client.close()
