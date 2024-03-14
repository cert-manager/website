import { withRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import getCurrentUrl from 'lib/currentUrl'
import Link from 'next/link'
import CirclesBackground from '../components/snippets/CirclesBackground'
import Dots from '../components/Dots'
import Hero from '../components/Hero'
import Image from '../components/Image'
import { meta as page } from '../content/pages/support.mdx'

function Support({ router }) {
  const currentUrl = getCurrentUrl(router)
  return <>
    <NextSeo
      title={page.title}
      description={page.description}
      canonical={currentUrl}
      openGraph={{
        url: currentUrl,
        title: page.title,
        description: page.description
      }}
    />
    <div className="bg-gray-1 relative overflow-hidden pb-48">
      <Hero heading={page.hero.heading} description={page.hero.description} />
      <div className="hidden lg:block absolute top-400px right-0 z-0 overflow-hidden">
        <CirclesBackground />
      </div>
      <div className="relative z-100 container">
        <div className="max-w-3xl">
          <Dots className="mb-8">
            <h2 className="text-4xl uppercase">{page.intro.heading}</h2>
          </Dots>
          <p className="text-lg mb-6">{page.intro.description}</p>
          <div className="bg-white px-9 py-8 rounded-5px relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-full">
              <Image
                src="/images/venafi-hero.png"
                alt="Venafi TLS Protect for Kubernetes"
                width={960}
                height={384}
                layout="fill"
                className="object-cover"
              />
            </div>
            <div className="relative z-100">
              <Image
                src={page.intro.cta.logo}
                alt={page.intro.heading}
                width={300}
                height={75}
              />
              <p className="text-black text-lg mb-5 sm:mr-60">
                {page.intro.cta.description}
              </p>
              <Link
                href={page.intro.cta.href}
                target="_blank"
                className="inline-block bg-blue-1 px-6 py-3 rounded-5px text-white text-sm no-underline">

                {page.intro.cta.caption}

              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=34e46cb4-8956-48fc-a9a2-a8d634b8968c" />
  </>;
}

export default withRouter(Support)
