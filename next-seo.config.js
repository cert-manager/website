export default {
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: `${process.env.NEXT_PUBLIC_URL}`,
    site_name: 'cert-manager',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/images/og1.png`,
        width: 1200,
        height: 630,
        alt: 'cert-manager — automated Kubernetes X.509 certificates'
      }
    ]
  }
}
