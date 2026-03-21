from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_db, close_db
from app.routers import works, authors, institutions, sources, topics, concepts, stats, databases


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(works.router, prefix="/api")
app.include_router(authors.router, prefix="/api")
app.include_router(institutions.router, prefix="/api")
app.include_router(sources.router, prefix="/api")
app.include_router(topics.router, prefix="/api")
app.include_router(concepts.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(databases.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "ImpactU OpenAlexCO API", "docs": "/docs"}
