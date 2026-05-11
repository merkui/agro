export interface Producto {
  id: string
  producto_nombre: string
  producto_descripcion: string | null
  producto_formulacion: string | null
  producto_plaga: string | null
  estado: string
  categoria: Categoria
  created_at: string
  image_urls: string[] | null
}

export type Categoria = 'insecticidas' | 'herbicidas' | 'fungicidas'

export const CATEGORIAS: { value: Categoria; label: string; description: string }[] = [
  { 
    value: 'insecticidas', 
    label: 'Insecticidas', 
    description: 'Control efectivo de plagas e insectos' 
  },
  { 
    value: 'herbicidas', 
    label: 'Herbicidas', 
    description: 'Eliminación de malezas y hierbas no deseadas' 
  },
  { 
    value: 'fungicidas', 
    label: 'Fungicidas', 
    description: 'Protección contra hongos y enfermedades' 
  },
]
