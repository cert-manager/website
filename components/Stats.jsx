import Icon from './Icon'

export default function Stats({ stats, className = '' }) {
  return (
    <div className={className}>
      <div className="bg-white">
        <div className="container grid grid-cols-1 gap-8 transform -translate-y-5 pb-2 md:grid-cols-3 lg:-translate-y-30px">
          {stats.map((stat, idx) => (
            <div
              className="text-center flex flex-col items-center text-blue-1"
              key={idx}
            >
              <div className="w-8 mb-5 lg:w-60px lg:mb-12">
                <Icon name={stat.icon} />
              </div>
              <p className="text-lg font-bold lg:text-xl">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
