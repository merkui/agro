import Image from 'next/image'
import { Leaf, Target, Users, Award } from 'lucide-react'

export default function QuienesSomosPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      {/* Main Section */}
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column - Text */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Quienes Somos
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Somos una empresa dedicada a ofrecer soluciones agricolas de alta calidad. 
            Con mas de 20 anos de experiencia en el mercado, nos hemos consolidado como 
            lideres en la distribucion de productos para la proteccion de cultivos.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nuestro compromiso es brindar a los agricultores las mejores herramientas 
            para proteger sus cultivos, garantizando productos efectivos, seguros y 
            respetuosos con el medio ambiente.
          </p>
          
          {/* Values */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mision</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Proveer soluciones agricolas innovadoras y sostenibles.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vision</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ser referentes en el sector agroquimico a nivel regional.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Equipo</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Profesionales comprometidos con la excelencia.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Award className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Calidad</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Productos certificados y garantizados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/quienes-somos.jpg"
              alt="Equipo y empresa AgroProductos"
              width={1200}
              height={900}
              className="size-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 border-t border-border pt-16 lg:mt-24 lg:pt-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">20+</div>
            <div className="mt-2 text-sm text-muted-foreground">Anos de experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">500+</div>
            <div className="mt-2 text-sm text-muted-foreground">Clientes satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">100+</div>
            <div className="mt-2 text-sm text-muted-foreground">Productos disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <div className="mt-2 text-sm text-muted-foreground">Soporte tecnico</div>
          </div>
        </div>
      </div>
    </div>
  )
}
