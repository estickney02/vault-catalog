import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  const hasImage = product.images && product.images.length > 0

  return (
    <div className="group flex flex-col bg-v-surface border border-v-border hover:border-v-gold/40 transition-all duration-300">
      {/* Image area */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full img-placeholder flex items-center justify-center">
            <span className="text-[2rem] tracking-[0.3em] font-bold text-v-border select-none">
              EMONEYFINDS
            </span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-v-gold text-v-black text-[10px] font-bold tracking-widest px-2 py-1 uppercase">
            Featured
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.id}`}
            className="text-sm font-medium text-v-text hover:text-v-gold transition-colors duration-200 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {product.brand && (
            <span className="text-[10px] tracking-widest uppercase text-v-gold border border-v-gold/40 px-2 py-0.5">
              {product.brand}
            </span>
          )}
          {product.type && (
            <span className="text-[10px] tracking-widest uppercase text-v-muted border border-v-border px-2 py-0.5">
              {product.type}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold block text-center w-full text-[11px]"
          >
            Shop on KakoBuy
          </a>
        </div>
      </div>
    </div>
  )
}
