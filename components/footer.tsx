import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#1f4f31] bg-[#123820] text-[#f4fbf1]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="size-8 text-[#dff7d7]" />
              <span className="text-xl font-bold text-[#f4fbf1]">AgroProductos</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#dff7d7]">
              Soluciones agrícolas de calidad para proteger y potenciar sus cultivos.
            </p>
            <Link
              className="group/btn -ml-2 mt-2 inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-[#f4fbf1] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              href="/admin"
            >
              Admin
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#f4fbf1]">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#dff7d7]">
                <MapPin className="size-4 text-[#f4fbf1]" />
                <span>Av. Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#dff7d7]">
                <Phone className="size-4 text-[#f4fbf1]" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#dff7d7]">
                <Mail className="size-4 text-[#f4fbf1]" />
                <span>contacto@agroproductos.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#f4fbf1]">Síguenos</h3>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-[#dff7d7] transition-colors hover:bg-white/20 hover:text-white"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-[#dff7d7] transition-colors hover:bg-white/20 hover:text-white"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-[#dff7d7] transition-colors hover:bg-white/20 hover:text-white"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#1f4f31] pt-8">
          <p className="text-center text-sm text-[#dff7d7]">
            &copy; {new Date().getFullYear()} AgroProductos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
