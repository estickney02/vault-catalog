import Link  from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  const hasImage = product.images && product.images.length > 0

  return (
    <div className="product-card group flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-emf-surface">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emf-pink-lt/40 to-emf-surface flex items-center justify-center">
            <span className="font-script text-2xl text-emf-pink/40">Emoney Finds</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1 bg-emf-white">
        {product.brand && (
          <span className="pill-pink self-start">{product.brand}</span>
        )}
        <Link href={`/product/${product.id}`}
          className="font-display font-semibold text-sm text-emf-black hover:text-emf-pink-dk transition-colors leading-snug line-clamp-2">
          {product.name}
        </Link>
        {product.price && (
          <span className="font-display text-sm font-semibold text-emf-pink-dk">{product.price}</span>
        )}
        <div className="mt-auto pt-3">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-black block text-center w-full text-[10px]"
          >
            Shop on KakoBuy →
          </a>
        </div>
      </div>
    </div>
  )
}
