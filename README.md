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
gamestores/
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
https://ui.aceternity.com/components/expandable-card
https://ui.aceternity.com/components/focus-cards
https://ui.aceternity.com/components/3d-card-effect
https://ui.aceternity.com/components/stateful-button
blog ->
https://ui.aceternity.com/components/bento-grid
https://ui.aceternity.com/components/3d-marquee