# ImpactU OpenAlexCO

Sitio web para explorar la producción académica almacenada en la base de datos **openalexco** (MongoDB), con una interfaz similar a [openalex.org](https://openalex.org).

## Stack

| Capa | Tecnología |
|---|---|
| Backend API | FastAPI + Motor (async MongoDB) |
| Base de datos | MongoDB (`openalexco`) |
| Frontend | Next.js 14 + Material UI v6 + React Query |

## Estructura

```
impactu_openalex/
├── backend/          # FastAPI API
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── config.py
│       ├── database.py
│       ├── utils.py
│       └── routers/
│           ├── works.py
│           ├── authors.py
│           ├── institutions.py
│           ├── sources.py
│           ├── topics.py
│           ├── concepts.py
│           └── stats.py
└── frontend/         # Next.js app
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx             # Home con stats
    │   │   ├── works/page.tsx
    │   │   ├── works/[id]/page.tsx
    │   │   ├── authors/page.tsx
    │   │   ├── authors/[id]/page.tsx
    │   │   ├── institutions/page.tsx
    │   │   ├── institutions/[id]/page.tsx
    │   │   ├── sources/page.tsx
    │   │   ├── sources/[id]/page.tsx
    │   │   ├── topics/page.tsx
    │   │   ├── topics/[id]/page.tsx
    │   │   ├── concepts/page.tsx
    │   │   └── concepts/[id]/page.tsx
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── OaBadge.tsx
    │   │   ├── PaginationControls.tsx
    │   │   └── LoadingError.tsx
    │   └── lib/
    │       ├── api.ts               # Cliente axios + tipos TypeScript
    │       └── theme.ts             # Tema MUI personalizado
    └── package.json
```

## Inicio rápido

### Prerequisitos
- MongoDB corriendo localmente con la DB `openalexco`
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000`.  
Documentación Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El sitio queda en `http://localhost:3000`.

### Variables de entorno

**backend/.env**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB=openalexco
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Con Docker Compose

```bash
docker-compose up --build
```

> Nota: Asegúrate de que MongoDB esté accesible desde el contenedor.

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/stats` | Conteos totales de todas las colecciones |
| GET | `/api/works` | Lista works (q, page, per_page, type, year, is_oa) |
| GET | `/api/works/{id}` | Detalle de un work |
| GET | `/api/authors` | Lista autores (q, page, per_page) |
| GET | `/api/authors/{id}` | Detalle de un autor |
| GET | `/api/institutions` | Lista instituciones (q, country_code, type) |
| GET | `/api/institutions/{id}` | Detalle de una institución |
| GET | `/api/sources` | Lista fuentes (q, is_oa, type) |
| GET | `/api/sources/{id}` | Detalle de una fuente |
| GET | `/api/topics` | Lista tópicos |
| GET | `/api/topics/{id}` | Detalle de un tópico |
| GET | `/api/concepts` | Lista conceptos (level) |
| GET | `/api/concepts/{id}` | Detalle de un concepto |

## Colecciones MongoDB soportadas

`works` · `authors` · `institutions` · `sources` · `topics` · `concepts` · `funders` · `publishers` · `domains` · `subfields` · `fields`
