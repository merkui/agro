import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="size-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AgroProductos</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Soluciones agricolas de calidad para proteger y potenciar sus cultivos.
            </p>
            <a data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5 group/btn -ml-2 text-primary" href="/admin">Admin<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Av. Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-primary" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 text-primary" />
                <span>contacto@agroproductos.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Siguenos</h3>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AgroProductos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
