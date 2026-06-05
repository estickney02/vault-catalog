import Link from 'next/link'
import { readJson } from '@/lib/blobDb'

const DEFAULT_LINK = 'https://ikako.vip/r/EMONEYFINDS'

const STEPS = [
  { n: '01', title: 'Sign Up',    body: 'Create your free KakoBuy account using my link below.', cta: true },
  { n: '02', title: 'I Find It',  body: "I source and vet the best dupe finds from KakoBuy so you don't have to." },
  { n: '03', title: 'I Curate It',body: 'Every product is organized by brand, type, and style — easy to browse.' },
  { n: '04', title: 'You Click',  body: 'Hit the link, land directly on the product page on KakoBuy.' },
  { n: '05', title: 'You Save',   body: 'No middleman markup. You pay KakoBuy directly. Always.' },
]

export default async function HowItWorks() {
  const settings = await readJson('settings', {})
  const link = settings.kakobuyLink || DEFAULT_LINK

  return (
    <section id="how-it-works" className="bg-emf-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-eyebrow mb-3">Simple Process</p>
          <h2 className="font-script text-5xl md:text-6xl text-emf-ivory leading-none">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col gap-4">
              <span className="font-display font-bold text-5xl text-emf-pink leading-none">{step.n}</span>
              <h3 className="font-script text-2xl text-emf-ivory leading-tight">{step.title}</h3>
              <p className="font-display text-sm text-emf-ivory/50 leading-relaxed">{step.body}</p>
              {step.cta && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="btn-pink self-start mt-2 text-[11px]">
                  Sign Up on KakoBuy →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
