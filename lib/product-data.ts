import type { Categoria, Producto } from './types'

export const PRODUCTOS: Producto[] = [
  {
    id: 'b69b50fb-4f13-4d71-9105-42c5676588fe',
    producto_nombre: 'Insecticida MaxBio',
    producto_presentacion: 'Envase por 1 litro',
    producto_descripcion: 'Control efectivo de insectos en cultivos de hoja ancha.',
    producto_formulacion: 'Emulsión concentrada 45%',
    producto_plaga: 'Trips, Mosca blanca, Pulgones',
    estado: 'destacado',
    categoria: 'insecticidas',
    created_at: '2026-04-01T08:30:00.000Z',
    image_urls: ['/cropsafe.jpg'],
  },
  {
    id: 'e8d1f0bf-613a-4409-8a9b-12c6cc3f39ee',
    producto_nombre: 'Insecticida AgroShield',
    producto_presentacion: 'Bidón por 5 litros',
    producto_presentacion: 'Bidón por 5 litros',
    producto_descripcion: 'Protege cultivos frutales y vegetales contra plagas de chupadores.',
    producto_formulacion: 'Suspensión concentrada 20%',
    producto_plaga: 'Acaros, Chicharritas, Minadores',
    estado: 'destacado',
    categoria: 'insecticidas',
    created_at: '2026-04-03T10:15:00.000Z',
    image_urls: ['/insecticida.jpg'],
  },
  {
    id: 'a2f4c5e7-1d2a-4a67-801c-4d5a9b7fbc22',
    producto_nombre: 'Insecticida NovaGuard',
    producto_presentacion: 'Envase por 2 litros',
    producto_descripcion: 'Fórmula biodegradable para aplicaciones foliares en cultivos orgánicos.',
    producto_formulacion: 'Cebo líquido 12%',
    producto_plaga: 'Gusanos, Saltamontes, Mosca del fruto',
    estado: 'nuevo',
    categoria: 'insecticidas',
    created_at: '2026-04-06T14:20:00.000Z',
    image_urls: ['/ecostop.jpg'],
  },
  {
    id: '5c2e9a7a-8d3b-4bde-9f6e-3c1d1a2f6c45',
    producto_nombre: 'Insecticida BioCero',
    producto_presentacion: 'Envase por 1 kilo',
    producto_descripcion: 'Solución para control de insectos resistentes con acción prolongada.',
    producto_formulacion: 'Microencapsulado 28%',
    producto_plaga: 'Pulguillas, Chinches, Termitas',
    estado: 'oferta',
    categoria: 'insecticidas',
    created_at: '2026-04-10T12:00:00.000Z',
    image_urls: ['/fungicida.jpg'],
  },
  {
    id: 'c7f0a8ff-256c-4bb6-a8ad-c76b4d63bffe',
    producto_nombre: 'Insecticida GreenForce',
    producto_presentacion: 'Envase por 5 kilos',
    producto_descripcion: 'Altamente efectivo en aplicaciones preventivas y de choque.',
    producto_formulacion: 'Emulsión líquida 30%',
    producto_plaga: 'Aphids, Cochinillas, Mosca blanca',
    estado: 'destacado',
    categoria: 'insecticidas',
    created_at: '2026-04-12T09:45:00.000Z',
    image_urls: ['/insecticida.jpg'],
  },
  {
    id: 'd0f92b5d-2b42-43a6-8f2e-41fc8d8b54b2',
    producto_nombre: 'Herbicida VerdePlus',
    producto_presentacion: 'Bidon por 5 litros',
    producto_descripcion: 'Elimina malezas de hojas anchas y gramíneas sin dañar el cultivo.',
    producto_formulacion: 'Granulado soluble 30%',
    producto_plaga: 'Malezas de hoja ancha, Gramíneas',
    estado: 'destacado',
    categoria: 'herbicidas',
    created_at: '2026-04-05T11:15:00.000Z',
    image_urls: ['/herbicida.jpg'],
  },
  {
    id: 'f8b3a1d2-6d6c-4ad9-8cad-8df0f9d6c22f',
    producto_nombre: 'Herbicida CampoClaro',
    producto_presentacion: 'Envase por 1 litro',
    producto_descripcion: 'Control sistémico para un amplio espectro de malezas.',
    producto_formulacion: 'Concentrado soluble 20%',
    producto_plaga: 'Malezas anuales, Malezas perennes',
    estado: 'nuevo',
    categoria: 'herbicidas',
    created_at: '2026-04-07T07:30:00.000Z',
    image_urls: ['/cropsafe.jpg'],
  },
  {
    id: '3dab1f4c-2db7-4d3e-aa5b-9c5d8f7b4604',
    producto_nombre: 'Herbicida SuperClear',
    producto_presentacion: 'Envase por 5 kilos',
    producto_descripcion: 'Actúa rápidamente sobre malezas difíciles en cultivos de cereales.',
    producto_formulacion: 'Granulado dispersable 25%',
    producto_plaga: 'Hierbas anuales, Treboles, Dicotiledóneas',
    estado: 'oferta',
    categoria: 'herbicidas',
    created_at: '2026-04-09T13:50:00.000Z',
    image_urls: ['/ecostop.jpg'],
  },
  {
    id: '1a8d2f3b-4c9e-4a2f-a8d7-5c1b2a3d4e5f',
    producto_nombre: 'Herbicida EcoStop',
    producto_presentacion: 'Envase por 2 litros',
    producto_descripcion: 'Diseñado para aplicaciones en rastrojo y áreas de descanso.',
    producto_formulacion: 'Suspensión concentrada 18%',
    producto_plaga: 'Maleza perenne, Maleza de hoja ancha',
    estado: 'destacado',
    categoria: 'herbicidas',
    created_at: '2026-04-11T10:10:00.000Z',
    image_urls: ['/ecostop.jpg'],
  },
  {
    id: 'b9c4d7e1-6f8a-41c3-8a2e-9f1b2c3d4a5b',
    producto_nombre: 'Herbicida RapidKill',
    producto_presentacion: 'Envase por 1 kilo',
    producto_descripcion: 'Fórmula rápida para controlar malezas resistentes en predios agrícolas.',
    producto_formulacion: 'Concentrado soluble 22%',
    producto_plaga: 'Hierbas resistentes, Malezas de hoja ancha',
    estado: 'nuevo',
    categoria: 'herbicidas',
    created_at: '2026-04-13T15:25:00.000Z',
    image_urls: ['/herbicida.jpg'],
  },
  {
    id: '7f7e24c7-3c42-4dcd-b1f1-6c9a79c1e06b',
    producto_nombre: 'Fungicida ProGuard',
    producto_presentacion: 'Envase por 1 kilo',
    producto_descripcion: 'Protege cultivos contra hongos y enfermedades foliares.',
    producto_formulacion: 'Polvo mojable 25%',
    producto_plaga: 'Oídio, Mildiu, Mancha foliar',
    estado: 'nuevo',
    categoria: 'fungicidas',
    created_at: '2026-04-08T09:00:00.000Z',
    image_urls: ['/fungicida.jpg'],
  },
  {
    id: '9de1c4ab-8b8f-463a-b6d4-6c2d5b3a7f68',
    producto_nombre: 'Fungicida ShieldPlus',
    producto_presentacion: 'Envase por 1 litro',
    producto_descripcion: 'Control preventivo y curativo para hongos en frutales y hortalizas.',
    producto_formulacion: 'Líquido soluble 30%',
    producto_plaga: 'Mildiu, Roya, Mancha angular',
    estado: 'destacado',
    categoria: 'fungicidas',
    created_at: '2026-04-02T12:40:00.000Z',
    image_urls: ['/insecticida.jpg'],
  },
  {
    id: '5a2f8c7b-3d4e-4b5f-9d6e-1a2b3c4d5e6f',
    producto_nombre: 'Fungicida BioGuard',
    producto_presentacion: 'Envase por 2 litros',
    producto_descripcion: 'Alternativa orgánica para el manejo de enfermedades fúngicas.',
    producto_formulacion: 'Microemulsión 20%',
    producto_plaga: 'Botrytis, Antracnosis, Mildiu',
    estado: 'oferta',
    categoria: 'fungicidas',
    created_at: '2026-04-04T11:05:00.000Z',
    image_urls: ['/herbicida.jpg'],
  },
  {
    id: '2b7e5c4d-1f3a-4e6f-9c8d-7a5b3c1d2e4f',
    producto_nombre: 'Fungicida CropSafe',
    producto_presentacion: 'Bidon por 5 litros',
    producto_descripcion: 'Estrategia de protección integral contra hongos y bacterias.',
    producto_formulacion: 'Concentrado emulsionable 28%',
    producto_plaga: 'Antracnosis, Mancha foliar, Podredumbre',
    estado: 'destacado',
    categoria: 'fungicidas',
    created_at: '2026-04-10T08:55:00.000Z',
    image_urls: ['/cropsafe.jpg'],
  },
  {
    id: '4c3d2b1a-6f7e-4d8c-9b0a-2e1f3d4c5b6a',
    producto_nombre: 'Fungicida TerraCare',
    producto_presentacion: 'Envase por 5 kilos',
    producto_descripcion: 'Protección de larga duración para cultivos sensibles a hongos.',
    producto_formulacion: 'Polvo mojable 32%',
    producto_plaga: 'Mildiu, Mancha parda, Roya',
    estado: 'nuevo',
    categoria: 'fungicidas',
    created_at: '2026-04-12T14:05:00.000Z',
    image_urls: ['/fungicida.jpg'],
  },
]

export function getAllProducts(filters: { categoria?: string; estado?: string } = {}) {
  return PRODUCTOS
    .filter((producto) => {
      if (filters.categoria && producto.categoria !== filters.categoria) {
        return false
      }
      if (filters.estado && producto.estado !== filters.estado) {
        return false
      }
      return true
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}

export function getFeaturedProducts(limit = 6) {
  return getAllProducts({ estado: 'destacado' }).slice(0, limit)
}

export function getProductById(id: string) {
  return PRODUCTOS.find((producto) => producto.id === id)
}

export function slugifyProductName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getProductUrl(producto: Producto) {
  return `/producto/${producto.categoria}/${slugifyProductName(producto.producto_nombre)}`
}

export function getProductBySlug(categoria: string, slug: string) {
  return PRODUCTOS.find(
    (producto) =>
      producto.categoria === categoria &&
      slugifyProductName(producto.producto_nombre) === slug,
  )
}
