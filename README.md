# GAMESTORES — Next.js + Headless WordPress (WPGraphQL) Starter


A minimal, production-ready starter template for a Headless WordPress + WooCommerce frontend using Next.js (App Router), TailwindCSS, and WPGraphQL.


---


## Features
- Next.js (App Router) with ISR/SSG/SSR examples
- WPGraphQL client (graphql-request)
- Example queries for posts, products, and authenticated customer actions
- TailwindCSS setup
- Basic product listing, product detail, and blog listing pages
- Env-based configuration and hints for JWT auth


---


## Project structure


```
huulostore-starter/
├─ .env.example
├─ package.json
├─ next.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ app/
│ ├─ layout.tsx
│ ├─ globals.css
│ ├─ page.tsx
│ ├─ products/page.tsx
│ ├─ product/[slug]/page.tsx
│ └─ blog/page.tsx
├─ components/
│ ├─ ProductCard.tsx
│ └─ Header.tsx
├─ lib/
│ ├─ wpClient.ts
│ └─ queries.ts
└─ README.md
```


---


## .env.example


```
# WordPress GraphQL endpoint
WP_GRAPHQL_ENDPOINT=https://gamestores.com/graphql


# Optional - JWT token if you pre-generate server-side tokens
WP_JWT_TOKEN=


# For server-side authenticated requests
WP_JWT_USERNAME=
WP_JWT_PASSWORD=
```
