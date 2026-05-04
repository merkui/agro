# Proyecto AgroProductos

## Resumen del proyecto

- Aplicación Next.js 16 con carpeta `app` y TypeScript.
- UI basada en Tailwind CSS y componentes de Radix UI.
- Se diseñó un sitio para un catálogo agrícola con productos de tipo insecticidas, herbicidas y fungicidas.
- La navegación principal incluye `Inicio`, `Productos` y `Quienes Somos`.
- Se usa un layout global con `Header` y `Footer`.

## Datos y arquitectura actual

- Antes se obtenían productos desde Supabase con `lib/supabase/server.ts` y variables de entorno.
- Se eliminó la dependencia de Supabase para el catálogo de productos.
- Se creó `lib/product-data.ts` con datos locales de ejemplo.
- Se agregaron funciones:
  - `getAllProducts(filters)`
  - `getFeaturedProducts(limit)`
  - `getProductById(id)`

## Campos de producto usados

- `id`: UUID
- `producto_nombre`: text
- `producto_descripcion`: text
- `producto_formulacion`: text
- `producto_plaga`: text
- `estado`: text
- `categoria`: insecticidas | herbicidas | fungicidas
- `created_at`: string ISO
- `image_urls`: string[]

## Cambios realizados

- Sustituido el fetch de productos desde Supabase por datos locales en `app/page.tsx`, `app/productos/page.tsx` y `app/productos/[id]/page.tsx`.
- Eliminados los archivos `lib/supabase/client.ts`, `lib/supabase/server.ts` y `.env` placeholder.
- Añadidos 5 productos de ejemplo por categoría en `lib/product-data.ts`.
- Implementada la funcionalidad de `Agregar al Presupuesto`.
- Creado el contexto `BudgetProvider` y el hook `useBudget` para gestionar el presupuesto en `localStorage`.
- Agregado botón de `Agregar al Presupuesto` y campo de cantidad en las tarjetas de producto y en el detalle del producto.
- Añadida la página `/presupuesto` para ver, editar cantidades y eliminar productos del presupuesto.
- Añadido ícono de carrito en el header con contador de items.
- Agregado toast de confirmación verde claro con botón `Ver Presupuesto`, aparición en la esquina superior derecha y duración de 4 segundos.
- Cambiado el icono de presupuesto en el header de `ShoppingCart` a `ClipboardList`.
- Ajustado el badge del contador de productos en el header para mostrar el número en blanco sobre fondo rojo.
- Asignada la imagen `/herbicida.jpg` al producto `Herbicida RapidKill` en `lib/product-data.ts`.
- Actualizado `components/product-card.tsx` para renderizar la primera imagen disponible de `producto.image_urls` y usar el placeholder solo cuando no hay imagen.
- Verificado con `pnpm exec tsc --noEmit` que no existían errores de TypeScript.
- Se dejó el proyecto listo para correr con `pnpm dev` usando datos locales.
