const { __QW_STORAGE_KEY, version } = browser.runtime.getManifest()
const ARGS_DELIMITER = ' '
console.log(`[v${version}] Qwiklinks`)

const BUILTIN_LINKS = [['_dash', '/ui/index.html']]

function fetchLinks() {
  return browser.storage.local
    .get(__QW_STORAGE_KEY)
    .then((res) => BUILTIN_LINKS.concat(res[__QW_STORAGE_KEY]))
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

/* Omnibox */

function escapeXml(str) {
  // https://developer.chrome.com/docs/extensions/reference/omnibox/#type-SuggestResult
  // https://stackoverflow.com/a/27979933
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
    }
  })
}

async function searchLinks(path) {
  const links = await fetchLinks()
  return links
    .filter(([name]) => name.startsWith(path) || name.includes(path))
    .sort(([name]) => !name.startsWith(path))
    .map(([name, url]) => ({ content: name, description: escapeXml(url) }))
}

browser.omnibox.onInputEntered.addListener(async function (text, disp) {
  const [path, ...args] = text.split(ARGS_DELIMITER)
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

/* Export */

browser.runtime.onMessage.addListener(function (msg) {
  if (msg.type === 'export') {
    const blob = new Blob([msg.data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    browser.downloads
      .download({
        filename: 'qwiklinks.json',
        url,
      })
      .then((id) => console.log('Starting export:', id))
      .catch((err) => console.error('Failed to start export:', err))
  }
})

browser.downloads.onChanged.addListener(function (delta) {
  if (delta.state && delta.state.current === 'complete') URL.revokeObjectURL(delta.url)
})
