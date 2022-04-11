import DotsPattern from './snippets/DotsPattern'

export default function Dots({ children, className = '' }) {
  return (
    <div className={className}>
      <div className="relative py-11px pl-42px">
        <DotsPattern className="absolute top-0 left-0 h-full" />
        {children}
      </div>
    </div>
  )
}
