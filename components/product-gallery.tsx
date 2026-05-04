'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Beaker } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const hasImages = images && images.length > 0
  
  const nextImage = () => {
    if (hasImages) {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }
  }
  
  const prevImage = () => {
    if (hasImages) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
        {hasImages ? (
          <>
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Imagen ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  onClick={prevImage}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  onClick={nextImage}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Beaker className="size-32 text-primary/30" />
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
