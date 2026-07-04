# AutoVisionX

Sistema inteligente de reconocimiento de Hot Wheels mediante visión por
computadora, catálogo visual, embeddings y análisis de color HEX.

## Arquitectura

```
Frontend (React + Vite)  →  Backend (ASP.NET Core 8)  →  IA Service (FastAPI)
                                     ↓
                                  SQLite
```

El frontend **nunca** llama directamente al servicio de IA. Todo pasa por el
backend, que actúa como orquestador.

```
AUTOVISIONX/
├─ frontend/       React + Vite + Tailwind + Axios + React Router
├─ backend/        ASP.NET Core 8 Web API + EF Core + SQLite
└─ ai-service/     FastAPI + PyTorch (CLIP) + OpenCV + scikit-learn
```

## Puesta en marcha (orden recomendado)

### 1) Servicio de IA (Python / FastAPI)

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Antes de poder reconocer autos reales, agrega entre 10 y 20 fotos de
referencia por modelo dentro de `data/catalog/<class_label>/` (ya existen
las 5 carpetas del MVP: `skyline_r34`, `toyota_supra`, `ford_mustang`,
`lamborghini_huracan`, `porsche_911`). Luego genera el índice de embeddings:

```bash
python -m app.embeddings.build_catalog
```

Y levanta el servicio:

```bash
uvicorn app.main:app --reload --port 8000
```

> Sin imágenes de referencia, el servicio sigue funcionando (detecta color
> real igualmente), pero el matching de modelo siempre devolverá
> "no reconocido" porque el catálogo de embeddings estará vacío.

### 2) Backend (ASP.NET Core 8)

Requiere el SDK de .NET 8 instalado (`dotnet --version` debe mostrar 8.x).

```bash
cd backend/AutoVisionX.API
dotnet restore
dotnet ef migrations add InitialCreate   # requiere dotnet-ef: dotnet tool install --global dotnet-ef
dotnet ef database update
dotnet run
```

Por defecto queda escuchando en `http://localhost:5000` (Swagger en
`/swagger`) y ya trae sembrados (seed) los 5 Hot Wheels del MVP.
`appsettings.json -> AiService:BaseUrl` apunta a `http://localhost:8000`.

### 3) Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`. En desarrollo, Vite hace proxy de
`/api/*` hacia `http://localhost:5000` (ver `vite.config.js`), así que el
frontend no necesita configuración adicional para hablar con el backend.

## Flujo real de una detección

1. El usuario sube una imagen o toma una foto (`HomePage`).
2. El frontend envía `POST /api/detection/predict` (multipart/form-data)
   al backend.
3. El backend guarda la imagen, la reenvía a `POST /predict` en el
   servicio de IA.
4. El servicio de IA genera el embedding con CLIP, lo compara contra el
   catálogo y detecta el color dominante con KMeans sobre OpenCV.
5. El backend recibe `predictedLabel + similarityScore + colores`, busca
   el Hot Wheels correspondiente en SQLite y arma la respuesta completa.
6. El backend guarda el registro en `DetectionHistory` y responde al
   frontend, que muestra la ficha de resultado (`DetectionResultPage`).

## Notas de diseño

- No hay cuentas de usuario, favoritos ni panel administrativo en la UI.
- La navegación es mínima: logo + Reconocimiento.
- El home usa una ilustración vectorial (SVG) del auto como imagen premium
  del hero, ya que el proyecto no incluye fotografía real; puedes
  reemplazarla por una foto de producto en
  `frontend/src/components/detection/HeroDetectionSection.jsx`.
- Las imágenes de la pantalla de escaneo y de resultado sí son la foto real
  subida o capturada por el usuario.
