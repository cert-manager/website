import Image from 'next/image'

export default function Img(props) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_PREVIEW === 'true'
  ) {
    return <Image unoptimized={true} {...props} />
  } else {
    // image optimization not necessary at the moment
    return <Image unoptimized={true} {...props} />
  }
}
