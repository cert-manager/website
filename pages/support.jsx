import { withRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import getCurrentUrl from 'lib/currentUrl'
import CirclesBackground from '../components/snippets/CirclesBackground'
import Hero from '../components/Hero'
import { meta as page } from '../content/pages/support.mdx'
import Image from 'components/Image'

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
          <div className="mb-8">
            <div className="relative">
              <h2>
                <Image
                  src={'/images/cyberark-logo-dark.svg'}
                  alt="CyberArk"
                  width={300}
                />
              </h2>
            </div>
          </div>
          <p className="text-lg mb-8"><a target="_blank" href="https://www.cyberark.com">CyberArk</a> is the principal maintainer of the cert-manager project and works directly with the CNCF. Commercial support and FIPS builds for cert-manager are available as part of CyberArk&apos;s Long Term Support (LTS) offering, including access to expertise to help organisations scale effectively and securely with cert-manager.</p>
          <div className="overflow-hidden"><a target="_blank" className="font-montserrat font-bold uppercase text-sm leading-20px btn-primary rounded-5px inline-flex items-center gap-3 px-8 py-4 " href="https://www.cyberark.com/services-support/long-term-support-for-cert-manager/"><span>Find Out More</span></a></div>
        </div>
      </div>
    </div>
    <img referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=34e46cb4-8956-48fc-a9a2-a8d634b8968c" />
  </>;
}

export default withRouter(Support)
