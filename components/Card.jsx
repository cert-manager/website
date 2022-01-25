export default function Card({ className, children }) {
  return (
    <div
      className={`bg-white rounded-5px ${className}`}
      style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}
    >
      {children}
    </div>
  )
}
