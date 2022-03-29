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
  return (
    <>
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
      <div className="bg-gray-1 relative overflow-hidden pb-117px">
        <Hero heading={page.hero.heading} description={page.hero.description} />
        <div className="hidden lg:block absolute top-400px right-0 z-0 overflow-hidden">
          <CirclesBackground />
        </div>
        <div className="relative z-100 container">
          <div className='max-w-3xl'>
            <Dots className="mb-8">
              <h2 className='text-4xl uppercase'>{page.intro.heading}</h2>
            </Dots>
            <p className='text-lg mb-6'>{page.intro.description}</p>
            <div className='bg-black px-9 py-8 rounded-5px relative overflow-hidden'>
              <div className="absolute top-0 right-0 h-full w-full">
                <Image
                  src='/images/enterprise-cta-background.svg'
                  alt='Jetstack secure'
                  width={507}
                  height={206}
                  layout="fill"
                  className="object-cover"
                />
              </div>
              <div className='relative z-100'>
                <Image
                  src={page.intro.cta.logo}
                  alt={page.intro.heading}
                  width={228}
                  height={58}
                />
                <p className='text-white font-semibold text-lg mb-5'>{page.intro.cta.description}</p>
                <Link href={page.intro.cta.href}>
                  <a target="_blank" className='inline-block bg-indigo px-6 py-3 rounded-5px text-white text-sm no-underline'>{page.intro.cta.caption}</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Support)
