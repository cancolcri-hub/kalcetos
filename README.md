# Kalcetos 🧦

Tienda eCommerce de calcetines con carácter. Storefront completo construido con **Next.js 16**, **Supabase** y **Stripe**, desplegado en **Vercel**.

🔗 **Demo en producción:** [kalcetos.shop](https://kalcetos.shop)

---

## Qué es

eCommerce funcional de principio a fin: catálogo de producto, ficha con variantes, carrito persistente, checkout con pago real vía Stripe, emails transaccionales y páginas legales conformes a normativa española (RGPD/LSSI). Diseño propio con paleta veraniega y vibe divertido.

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Server Components) |
| Lenguaje | TypeScript |
| Base de datos | Supabase (PostgreSQL + RLS, región EU) |
| Pagos | Stripe (Checkout + Webhooks) |
| Email | Resend (transaccional) |
| Estilos | Tailwind CSS v4 + shadcn / Base UI |
| Estado | Zustand (carrito) |
| Formularios | React Hook Form + Zod |
| Deploy | Vercel |

## Funcionalidades

- 🛍️ Catálogo de productos servido desde Supabase con imágenes en Supabase Storage
- 📄 Ficha de producto dinámica (`/productos/[slug]`)
- 🛒 Carrito persistente con Zustand
- 💳 Checkout con Stripe + manejo de webhooks (`/api/stripe`) y páginas success/cancel
- 📧 Emails transaccionales con Resend
- 🔒 Seguridad: `service_role` solo en servidor, RLS en tablas sensibles (customers, orders)
- ⚖️ Páginas legales: aviso legal, privacidad, devoluciones y cookies (España)

## Estructura

```
app/
├── productos/[slug]/   # Catálogo y ficha de producto
├── carrito/            # Carrito
├── checkout/           # Checkout + success / cancel
├── api/stripe/         # Webhooks de Stripe
└── legal/              # Aviso legal, privacidad, devoluciones, cookies
components/             # UI (shadcn / Base UI)
lib/                    # Clientes Supabase + Stripe
supabase/migrations/    # Esquema PostgreSQL (schema kalcetos)
scripts/                # Import de productos + subida de imágenes
```

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local   # rellena con tus claves (Supabase, Stripe, Resend)

# 3. Arrancar
npm run dev                  # http://localhost:3000
```

> Las variables sensibles (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) viven solo en `.env.local`, nunca en el repo. Usa claves Stripe **test** en desarrollo.

## Scripts útiles

```bash
npm run build    # build de producción
npm run lint     # ESLint
```

---

Hecho por [Digital Project](https://digitalproject.pro) · Primera tienda del sistema **Ecommerce OS**.
