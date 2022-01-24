import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../next-seo.config'
import { DefaultSeo } from 'next-seo'

import 'windi.css'
import 'styles/global.scss'
import 'styles/docs.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
