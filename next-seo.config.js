const deployUrl = 'https://cert-manager.io'

export default {
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: `${deployUrl}`,
    site_name: 'cert-manager',
    images: [
      {
        url: `${deployUrl}/images/og1.png`,
        width: 1200,
        height: 630,
        alt: 'cert-manager — automated Kubernetes X.509 certificates'
      }
    ]
  }
}
