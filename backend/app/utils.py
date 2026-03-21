# Shared helpers for query building and pagination
import re

OPENALEX_BASE = "https://openalex.org/"

# Prefixes used by each OpenAlex entity type
_OPENALEX_PREFIXES = ("W", "A", "I", "S", "T", "C", "F", "P")


def _is_openalex_id(q: str) -> bool:
    """Return True if *q* looks like an OpenAlex ID (URL or short form)."""
    q = q.strip()
    if q.startswith("https://openalex.org/"):
        return True
    # Short form: letter prefix + digits, e.g. W1234567, A5065305280
    if len(q) >= 2 and q[0].upper() in _OPENALEX_PREFIXES and q[1:].isdigit():
        return True
    return False


def build_text_filter(q: str | None, fields: list[str]) -> dict:
    """Build a MongoDB text filter using $text (text index required).

    Falls back to a case-insensitive regex $or when *q* is a single
    short token containing non-word characters (e.g. an ID fragment)
    that the tokeniser would not match reliably.
    """
    if not q:
        return {}
    # Use MongoDB full-text search — efficient when a text index exists.
    # Wrap multi-word queries in double-quotes for phrase matching.
    terms = q.strip().split()
    search_str = f'"{q.strip()}"' if len(terms) > 1 else q.strip()
    return {"$text": {"$search": search_str}}


def build_search_filter(q: str | None, fields: list[str]) -> dict:
    """Smart search filter: exact ID match OR full-text search.

    If *q* looks like an OpenAlex ID (URL or short form such as ``W1234567``),
    returns an exact ``{id: ...}`` filter on the indexed ``id`` field.
    Otherwise falls back to ``$text`` full-text search.
    """
    if not q:
        return {}
    if _is_openalex_id(q):
        return openalex_id_filter(q)
    return build_text_filter(q, fields)


def build_regex_filter(q: str | None, fields: list[str]) -> dict:
    """Case-insensitive regex search across *fields* (no index required).

    Prefer build_text_filter when a text index exists.  Use this helper
    only for fields that are not covered by a text index.
    """
    if not q:
        return {}
    escaped = re.escape(q)
    return {"$or": [{field: {"$regex": escaped, "$options": "i"}} for field in fields]}


def openalex_id_filter(short_id: str) -> dict:
    """Return a filter that matches by the full OpenAlex URL or the raw short_id.

    Accepts both short form (e.g. ``W1234567``) and full URL
    (e.g. ``https://openalex.org/W1234567``).
    Uses an exact-match on the indexed ``id`` field — O(log n).
    """
    if short_id.startswith("http"):
        return {"id": short_id}
    return {"id": f"{OPENALEX_BASE}{short_id}"}
    """Build a MongoDB text filter using $text (text index required).

    Falls back to a case-insensitive regex $or when *q* is a single
    short token containing non-word characters (e.g. an ID fragment)
    that the tokeniser would not match reliably.
    """
    if not q:
        return {}
    # Use MongoDB full-text search — efficient when a text index exists.
    # Wrap multi-word queries in double-quotes for phrase matching.
    terms = q.strip().split()
    search_str = f'"{q.strip()}"' if len(terms) > 1 else q.strip()
    return {"$text": {"$search": search_str}}


def build_regex_filter(q: str | None, fields: list[str]) -> dict:
    """Case-insensitive regex search across *fields* (no index required).

    Prefer build_text_filter when a text index exists.  Use this helper
    only for fields that are not covered by a text index.
    """
    if not q:
        return {}
    escaped = re.escape(q)
    return {"$or": [{field: {"$regex": escaped, "$options": "i"}} for field in fields]}


def clean_doc(doc: dict) -> dict:
    """Convert ObjectId _id to string and remove internal mongo fields."""
    if doc is None:
        return {}
    doc["_id"] = str(doc["_id"])
    return doc


def paginate_params(page: int, per_page: int) -> tuple[int, int]:
    skip = (page - 1) * per_page
    return skip, per_page
