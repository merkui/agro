import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bug, Sprout, Shield } from 'lucide-react'

interface CategoryCardProps {
  title: string
  description: string
  href: string
  icon: 'insecticidas' | 'herbicidas' | 'fungicidas'
}

const iconMap = {
  insecticidas: Bug,
  herbicidas: Sprout,
  fungicidas: Shield,
}

export function CategoryCard({ title, description, href, icon }: CategoryCardProps) {
  const Icon = iconMap[icon]
  
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <Icon className="size-10 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <Button variant="outline" size="sm" className="group/btn" asChild>
          <Link href={href}>
            Ver productos
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
