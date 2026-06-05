// Section divider marquee — black background, pink text
export default function Marquee() {
  const words = ['NEW ARRIVALS','BEST FINDS','KAKOBUY CURATED','LATEST DROPS','SHOP SMARTER','NEW ARRIVALS','BEST FINDS','KAKOBUY CURATED','LATEST DROPS','SHOP SMARTER']

  const items = words.map((w, i) => (
    <span key={i} className="inline-flex items-center gap-6 mx-6">
      <span className="text-emf-pink text-xs tracking-[0.3em] font-display font-semibold uppercase">{w}</span>
      <span className="text-emf-pink/40 text-[8px]">◆</span>
    </span>
  ))

  return (
    <div className="bg-emf-black overflow-hidden py-4">
      <div className="flex animate-marquee-fast whitespace-nowrap">
        {items}{items}
      </div>
    </div>
  )
}
