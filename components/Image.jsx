import Image from "next/image";

export default function Img(props) {
  // image optimization not necessary at the moment
  return <Image unoptimized={true} {...props} />
}
