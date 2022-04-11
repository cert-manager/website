const deployUrl = 'https://cert-manager.io'

export default {
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: 'https://cert-manager.io/',
    site_name: 'cert-manager',
    images: [
      {
        url: `https://${deployUrl}/images/og.png`,
        width: 184,
        height: 78,
        alt: 'cert-manager'
      }
    ]
  }
}
