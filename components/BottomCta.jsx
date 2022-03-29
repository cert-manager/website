import CtasRow from './CtasRow'

export default function BottomCta({ content, className = '' }) {
  return (
    <section className={className}>
      <div className="text-center">
        <h2 className="text-2xl mb-8 md:text-3xl mb-12">{content.heading}</h2>
        <CtasRow ctas={content.ctas} />
      </div>
    </section>
  )
}
