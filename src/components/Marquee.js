export default function Marquee() {
  const items = [
    'BEST FINDS',
    'KAKOBUY CURATED',
    'SHOP SMARTER',
    'QUALITY OVER QUANTITY',
    'EMONEYFINDS APPROVED',
    'NEW ARRIVALS',
    'ELEVATED BASICS',
    'DESIGNER INSPIRED',
    'HAND SELECTED',
    'EMONEYFINDS PICKS',
  ]

  const content = items.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-8 mx-8">
      <span className="text-xs tracking-[0.3em] font-medium text-v-text">{item}</span>
      <span className="text-v-gold text-xs">◆</span>
    </span>
  ))

  return (
    <div className="marquee-container overflow-hidden bg-v-surface border-y border-v-border py-3">
      <div className="marquee-track flex animate-marquee whitespace-nowrap">
        {content}
        {content}
      </div>
    </div>
  )
}
