El proyecto se llama AgroProductos y es una aplicación web para el sector agropecuario. Esto es lo que hace:

Proposito principal: Catalogo de agroinsumos con sistema de presupuestos y panel de administracion.

Funcionalidades clave:

Catalogo de productos agricolas (insecticidas, herbicidas, fungicidas) con filtros y pagina de detalle por producto.
Presupuesto — los clientes agregan productos, ingresan cantidad y envian el pedido por formulario; persiste en localStorage.
Panel Admin (/admin/presupuestos) — permite ver los pedidos recibidos, ingresar precios unitarios, calcular totales y enviar el presupuesto cotizado al email del cliente.
Pagina institucional "Quienes Somos".
Stack tecnico:

Next.js 16 + React 19 + TypeScript
Tailwind CSS + Radix UI (componentes)
Supabase (base de datos de productos)
Nodemailer (envio de emails)
pnpm
Rutas principales: / → /productos → /productos/[id] → /presupuesto → /admin/presupuestos