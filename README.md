# AgroProductos

Aplicacion web para catalogo de agroinsumos, armado de presupuestos y gestion
administrativa de solicitudes. El proyecto esta construido con Next.js, React,
TypeScript, Tailwind CSS y componentes basados en Radix UI.

## Funcionalidades

- Catalogo de productos agricolas por categoria: insecticidas, herbicidas y fungicidas.
- Filtros por categoria y estado del producto.
- Pagina de detalle para cada producto.
- Carga de productos al presupuesto con seleccion de cantidad.
- Presupuesto persistido en `localStorage` del navegador.
- Formulario para que el cliente envie su presupuesto al administrador.
- Panel admin para ver presupuestos recibidos.
- Edicion de precio unitario por producto desde el panel admin.
- Calculo automatico de subtotales y total general.
- Guardado de presupuestos cotizados en Supabase.
- Envio de presupuesto cotizado al email del cliente.
- Imagen institucional en la pagina `Quienes Somos`.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Nodemailer
- Supabase
- pnpm

## Requisitos

- Node.js 20 o superior
- pnpm

Notas:

- `ADMIN` recibe los presupuestos enviados por los clientes.
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` conectan la app con Supabase.
- `SUPABASE_PRODUCTS_TABLE` permite cambiar el origen de productos, por defecto `productos`.
- `SMTP_*` se usa para enviar emails desde la aplicacion.
- El archivo `.env.local` esta ignorado por Git y no debe subirse al repositorio.

## Rutas principales

- `/` - Inicio.
- `/productos` - Catalogo de productos.
- `/productos/[id]` - Detalle de producto.
- `/presupuesto` - Presupuesto del cliente y formulario de envio.
- `/quienes-somos` - Informacion institucional.
- `/admin` - Login del administrador.
- `/admin/presupuestos` - Panel de presupuestos recibidos.

## Admin

La pantalla admin usa una autenticacion simple en el navegador para esta version
del proyecto.

```text
Password de prueba: 1234
```

Desde `/admin/presupuestos` se puede:

- Ver los datos del cliente.
- Ver productos y cantidades solicitadas.
- Ingresar precio unitario por producto.
- Ver subtotal por fila.
- Ver total general del presupuesto.
- Guardar el presupuesto cotizado.
- Enviar el presupuesto al email del cliente.

## Datos de productos en Supabase

Los productos se leen desde Supabase usando:

```text
lib/products.ts
```

La tabla o vista configurada en `SUPABASE_PRODUCTS_TABLE` debe exponer estos campos:

```ts
{
  id: string
  producto_nombre: string
  producto_descripcion: string
  producto_formulacion: string
  producto_plaga: string
  estado: string
  categoria: 'insecticidas' | 'herbicidas' | 'fungicidas'
  created_at: string
  image_urls: string[]
}
```

Si tus tablas estan normalizadas con relaciones, se recomienda crear una vista en
Supabase que exponga esos nombres de columnas para el catalogo. Por defecto la
app consulta la tabla o vista `productos`.

Las imagenes pueden ser rutas publicas locales o URLs absolutas, por ejemplo:

```ts
image_urls: ['/insecticida.jpg']
image_urls: ['https://...supabase.co/storage/v1/object/public/.../producto.jpg']
```

## Presupuestos guardados

Los presupuestos enviados se guardan en Supabase, en las tablas `customers`,
`quotes` y `quote_items`. Contienen los datos del cliente, productos
solicitados, cantidades y, cuando se completa desde admin, los precios unitarios.

## Imagenes

La imagen de la pagina `Quienes Somos` esta en:

```text
public/quienes-somos.jpg
```

Para esa seccion se recomienda una imagen horizontal con proporcion 4:3, por
ejemplo `1200 x 900 px`.
