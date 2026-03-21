"""
Ensure all required MongoDB indexes exist for optimal query performance.
This module is called once on application startup and is idempotent:
- If the index already exists with the same definition, create_index is a no-op.
- If a conflict is detected (different name / different definition), the error
  is logged as a warning and execution continues so the app still starts.
"""
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

# All collections that need a text index for $text search.
# Only ONE text index per collection is allowed in MongoDB.
TEXT_INDEXES = {
    "works": (["title", "display_name", "abstract"], "works_text"),
    "authors": (["display_name"], "authors_text"),
    "institutions": (["display_name"], "institutions_text"),
    "sources": (["display_name"], "sources_text"),
    "topics": (["display_name"], "topics_text"),
    "concepts": (["display_name"], "concepts_text"),
    "funders": (["display_name"], "funders_text"),
    "publishers": (["display_name"], "publishers_text"),
}


async def _idx(collection, keys, **kwargs) -> None:
    """Create an index, tolerating conflicts with pre-existing indexes.

    MongoDB returns code 85 (IndexOptionsConflict) when the same field(s)
    already have an index under a different name — which means the index
    exists and no action is needed.  Any other error is also logged and
    swallowed so that application startup is never blocked by index issues.
    """
    try:
        await collection.create_index(keys, **kwargs)
    except Exception as exc:
        from pymongo.errors import OperationFailure
        if isinstance(exc, OperationFailure) and exc.code == 85:
            # IndexOptionsConflict: index already exists with a different name — OK
            logger.debug(
                "Index already present on %s %s (different name, skipping)",
                collection.name, keys,
            )
        else:
            logger.warning(
                "Index skipped on %s %s: %s", collection.name, keys, exc
            )


async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create all indexes required by the API. Safe to call multiple times."""
    logger.info("Ensuring MongoDB indexes…")

    # ── works ──────────────────────────────────────────────────────────────
    await _idx(db.works, "id", background=True)
    await _idx(db.works, "type", background=True)
    await _idx(db.works, [("publication_year", -1)], background=True)
    await _idx(db.works, "open_access.is_oa", background=True)
    await _idx(db.works, "language", background=True)
    await _idx(db.works, [("cited_by_count", -1)], background=True)
    await _idx(db.works, [("type", 1), ("publication_year", -1)], background=True)
    await _idx(db.works, [("open_access.is_oa", 1), ("publication_year", -1)], background=True)

    # ── authors ────────────────────────────────────────────────────────────
    await _idx(db.authors, "id", background=True)
    await _idx(db.authors, [("cited_by_count", -1)], background=True)
    await _idx(db.authors, "works_count", background=True)

    # ── institutions ───────────────────────────────────────────────────────
    await _idx(db.institutions, "id", background=True)
    await _idx(db.institutions, "country_code", background=True)
    await _idx(db.institutions, "type", background=True)
    await _idx(db.institutions, [("cited_by_count", -1)], background=True)
    await _idx(db.institutions, [("country_code", 1), ("type", 1)], background=True)

    # ── sources ────────────────────────────────────────────────────────────
    await _idx(db.sources, "id", background=True)
    await _idx(db.sources, "is_oa", background=True)
    await _idx(db.sources, "type", background=True)
    await _idx(db.sources, [("works_count", -1)], background=True)

    # ── topics ─────────────────────────────────────────────────────────────
    await _idx(db.topics, "id", background=True)

    # ── concepts ───────────────────────────────────────────────────────────
    await _idx(db.concepts, "id", background=True)
    await _idx(db.concepts, "level", background=True)
    await _idx(db.concepts, [("works_count", -1)], background=True)
    await _idx(db.concepts, [("level", 1), ("works_count", -1)], background=True)

    # ── funders / publishers ───────────────────────────────────────────────
    await _idx(db.funders, "id", background=True)
    await _idx(db.publishers, "id", background=True)

    # ── text indexes (one per collection, language-agnostic) ───────────────
    # language_override points to a field that does NOT exist in any document,
    # so MongoDB always uses default_language="none" (language-agnostic stemming)
    # regardless of the actual "language" field stored in the documents.
    for col_name, (fields, index_name) in TEXT_INDEXES.items():
        weights = {f: (10 if f in ("title", "display_name") else 1) for f in fields}
        field_spec = [(f, "text") for f in fields]
        await _idx(
            db[col_name],
            field_spec,
            name=index_name,
            default_language="none",
            language_override="_text_lang_unused",   # ignore per-doc language field
            weights=weights,
            background=True,
        )

    logger.info("MongoDB indexes ready.")
