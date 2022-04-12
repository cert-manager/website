import { withRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import getCurrentUrl from 'lib/currentUrl'
import Link from 'next/link'
import Card from '../components/Card'
import CirclesBackground from '../components/snippets/CirclesBackground'
import CtasRow from '../components/CtasRow'
import Features from '../components/Features'
import Hero from '../components/home/Hero'
import Image from '../components/Image'
import JetstackLogo from '../components/snippets/JetstackLogo'
import Stats from '../components/Stats'
import { meta as page } from '../content/pages/homepage.mdx'

function Home({ router }) {
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
      <div className="bg-gray-1 relative overflow-x-hidden pb-117px">
        <Hero
          heading={page.hero.heading}
          description={page.hero.description}
          image={page.hero.image}
        />
        <div className="hidden lg:block absolute top-600px right-0 z-0">
          <CirclesBackground />
        </div>
        <div className="relative z-100">
          <Stats stats={page.stats} />
          <div className="container">
            <CtasRow className="my-8 lg:my-12" ctas={page.topCta.ctas} />
            <div className="mb-16 lg:mt-20 max-w-3xl mx-auto">
              <Image
                src="images/cert-manager-diagram.svg"
                alt="Cert Manager"
                width={756}
                height={518}
                layout="responsive"
              />
            </div>
            <Card className="mb-10 pt-7 pb-8 px-8 text-center md:flex md:gap-10 md:items-center md:text-left md:py-6 lg:px-12">
              <div className="flex-shrink-0">
                <Image
                  src={page.certManager.image.src}
                  alt={page.certManager.image.alt}
                  width={141}
                  height={136}
                  layout="fixed"
                />
              </div>
              <p className="font-semibold text-lg mt-8 md:mt-0">
                <span className="text-xl text-blue-2 font-bold">
                  {page.certManager.emphasize}
                </span>
                <span>&nbsp;{page.certManager.description}</span>
              </p>
            </Card>
            <Card className="px-7 py-8 text-center divide-y divide-gray-2 md:flex md:justify-center md:items-center md:text-left md:divide-y-0 md:divide-x lg:px-20 lg:py-8">
              <div className="pb-9 md:pb-0 md:pr-14">
                <Image
                  src="/images/cloud-native-logo.png"
                  alt="cloud native computing foundation logo"
                  width={283}
                  height={81}
                  layout="fixed"
                />
              </div>
              <div className="pt-9 text-lg md:pt-0 md:pl-14">
                <p>
                  <span className="font-bold inline-block mb-2">
                    cert-manager
                  </span>
                  <span>&nbsp;was created by </span>
                  <Link href="https://www.jetstack.io/">
                    <a>
                      <JetstackLogo className="mx-auto md:inline-block w-32" />
                    </a>
                  </Link>
                  <span className="block mt-5">
                    It was proudly &nbsp;
                    <Link href="https://www.jetstack.io/blog/cert-manager-cncf/">
                      <a target="_blank">donated</a>
                    </Link>
                    &nbsp; to CNCF in 2020.
                  </span>
                </p>
              </div>
            </Card>
            <Features features={page.features} className="mt-24" />
            <div>
              <CtasRow
                className="my-8 lg:mb-14 lg:mt-20"
                title={page.bottomCta.title}
                ctas={page.bottomCta.ctas}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
