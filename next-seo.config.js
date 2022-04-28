const deployUrl = 'https://cert-manager.io'

export default {
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: `${deployUrl}`,
    site_name: 'cert-manager',
    images: [
      {
        url: `${deployUrl}/images/og.png`,
        width: 184,
        height: 78,
        alt: 'cert-manager'
      }
    ]
  }
}
