const manifest = browser.runtime.getManifest()
const QW_STORAGE_KEY = manifest.__QW_STORAGE_KEY
console.log(`[v${manifest.version}] Qwiklinks`)

async function fetchLink(path, args) {
  // skull emoji
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
