const { __QW_STORAGE_KEY, version } = browser.runtime.getManifest()
const DELIMITER = ' '
console.log(`[v${version}] Qwiklinks`)

async function fetchLinks() {
  return browser.storage.local
    .get(__QW_STORAGE_KEY)
    .then((res) => res[__QW_STORAGE_KEY])
}

async function fetchLink(path, args) {
  const links = await fetchLinks()
  for (const [name, url] of links) {
    if (name === path)
      return url.replaceAll(/\$\d/g, function (match) {
        const idx = Number(match[1])
        return args[idx - 1] || match
      })
  }
  return null
}

async function searchLinks(path) {
  const links = await fetchLinks()
  return links
    .filter(([name]) => name.startsWith(path) || name.includes(path))
    .sort(([name]) => !name.startsWith(path))
    .map(([name, url]) => ({ content: name, description: url }))
}

browser.omnibox.onInputEntered.addListener(async function (text, disp) {
  const [path, ...args] = text.split(DELIMITER)
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

browser.omnibox.onInputChanged.addListener(function (text, suggest) {
  const path = text.split('/')[0]
  searchLinks(path).then(suggest)
})
