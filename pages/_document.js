import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/ga'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-touch-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicons/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/favicons/favicon.ico" />
          <link rel="icon" href="/favicons/favicon.ico" />
          {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_TRACKING_ID}');`
                }}
              />
            </>
          )}
        </Head>
        <body className="overflow-x-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
