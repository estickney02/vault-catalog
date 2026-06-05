// Thin always-visible scrolling marquee at very top of page
export default function TopBanner() {
  const text = [
    'Shop via KakoBuy',
    'Use my link',
    'Save on shipping',
    'New finds added weekly',
    'Shop via KakoBuy',
    'Use my link',
    'Save on shipping',
    'New finds added weekly',
  ]

  const items = text.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-5 mx-5">
      <span className="text-emf-pink text-[11px] tracking-[0.2em] font-display font-medium uppercase">
        {t}
      </span>
      <span className="text-emf-pink/40 text-[8px]">◆</span>
    </span>
  ))

  return (
    <div className="bg-emf-black overflow-hidden py-2">
      <div className="flex animate-marquee-slow whitespace-nowrap">
        {items}{items}
      </div>
    </div>
  )
}
