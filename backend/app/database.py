import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger(__name__)
client: AsyncIOMotorClient = None


def get_database():
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
