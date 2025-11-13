# Desafio Full Stack – Gerenciamento de Produtos

Aplicação Full Stack com back-end em Node.js/TypeScript/Express e banco SQL (SQLite via `sql.js`) e front-end em React (Vite) com Material UI. Possui cadastro/login com JWT, listagem com filtros, e CRUD de produtos restrito ao dono.

## Requisitos
- Node 16+ (recomendado) ou Docker

## Rodando com Docker
1. `docker compose up --build -d`
2. API: `http://localhost:4000/api` (saúde: `GET /api/health`)
3. Web: `http://localhost:5173/`

## Rodando localmente
### Back-end
1. `cd server`
2. `npm install`
3. `npm run build`
4. `npm start`
5. Variáveis: `JWT_SECRET` opcional (default `dev-secret`)

### Front-end
1. `cd client`
2. `npm install`
3. `npm run dev`
4. Acesse `http://localhost:5173/`
5. Opcional: `VITE_API_URL` para apontar para a API

## Endpoints principais
- `POST /api/auth/register` – `{ username, email, password }`
- `POST /api/auth/login` – `{ email, password }` → `{ token, user }`
- `GET /api/products` – filtros: `q`, `minPrice`, `maxPrice`
- `POST /api/products` – `{ name, description?, price }` (auth)
- `PUT /api/products/:id` – campos parciais (auth, dono)
- `DELETE /api/products/:id` (auth, dono)

## Postman
- Importar `postman/Desafio Fullstack.postman_collection.json`
- Variáveis: `baseUrl`, `token`, `id`

## Tecnologias
- Back-end: Express, TypeScript, JWT, bcryptjs, sql.js, Zod
- Front-end: React, Vite, TypeScript, Material UI, React Router

