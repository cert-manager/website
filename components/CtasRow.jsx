import Button from './Button'

export default function CtasRow({ ctas, title = '', className = '' }) {
  return (
    <div className={className}>
      {title && <h3 className="text-2xl text-center mb-8">{title}</h3>}
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
