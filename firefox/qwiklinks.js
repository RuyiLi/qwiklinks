const QW_STORAGE_KEY = browser.runtime.getManifest().__QW_STORAGE_KEY
const version = browser.runtime.getManifest().version
console.log(`[v${version}] Qwiklinks`)

async function fetchLink(path, args) {
  const urls = await browser.storage.local.get(QW_STORAGE_KEY)
  for (const url of urls[QW_STORAGE_KEY]) {
    if (url.short === path) {
      return url.url
    }
  }
  return null
}

browser.omnibox.onInputEntered.addListener(async function (text, disp) {
  const [path, ...args] = text.split('/')
  const url = await fetchLink(path, args)
  switch (disp) {
    case 'currentTab':
      browser.tabs.update({ url })
      break
    case 'newForegroundTab':
      browser.tabs.create({ url })
      break
    case 'newBackgroundTab':
      browser.tabs.create({ url, active: false })
      break
  }
})

browser.webRequest.onBeforeRequest.addListener(
  async function (details) {
    const { pathname } = new URL(details.url)
    const [path, ...args] = pathname.slice(1).split('/')
    return { redirectUrl: await fetchLink(path, args) }
  },
  {
    urls: ['*://qw/*'],
  },
  ['blocking']
)
