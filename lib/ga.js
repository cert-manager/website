export const GA_TRACKING_ID = 'UA-78700849-2'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (global.gtag && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    global.gtag('config', GA_TRACKING_ID, {
      page_path: url
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }, options) => {
  if (global.gtag && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    global.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...options
    })
  }
}
