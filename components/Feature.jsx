import Image from './Image'
import Card from './Card'

export default function Feature({ feature }) {
  return (
    <Card className="relative mt-9 pt-16 pb-6 px-7 text-center">
      <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <Image
          src={feature.imageSrc}
          alt="feature icon"
          width={77}
          height={74}
          layout="fixed"
        />
      </div>

      <p className="">{feature.description}</p>
    </Card>
  )
}
