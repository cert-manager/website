import Feature from './Feature'
import Dots from './Dots'

export default function Features({ features, className = '' }) {
  return (
    <section className={className}>
      <Dots className="mb-7 lg:mb-12">
        <h2 className="uppercase text-3xl lg:text-4xl">{features.heading}</h2>
      </Dots>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-12">
        {features.items.map((feature, idx) => (
          <Feature feature={feature} key={idx} />
        ))}
      </div>
    </section>
  )
}
