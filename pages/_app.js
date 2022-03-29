import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../next-seo.config'
import { DefaultSeo } from 'next-seo'
import { pageview } from 'lib/ga'

import 'windi.css'
import 'styles/global.scss'
import 'styles/docs.scss'

function CertManager({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
        pageview(url)
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <>
      <DefaultSeo {...SEO} />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default CertManager
