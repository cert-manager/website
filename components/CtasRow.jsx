import Button from './Button'

export default function CtasRow({ ctas, className = '' }) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-8 justify-center">
        {ctas.map((cta, idx) => (
          <Button
            key={idx}
            icon={cta.icon}
            href={cta.href}
            caption={cta.caption}
            target={cta.target}
          />
        ))}
      </div>
    </div>
  )
}
