;(async function () {
  const { __QW_STORAGE_KEY } = browser.runtime.getManifest()
  let links = await browser.storage.local
    .get(__QW_STORAGE_KEY)
    .then((res) => res[__QW_STORAGE_KEY] || [])

  const ERROR_CLASS = 'error'
  const ROW_CLASS = 'item-row'
  const INPUT_NAME_NAME = 'name'
  const INPUT_URL_NAME = 'url'

  const $ = document.querySelector.bind(document)
  const linksContainer = $('#links')
  const importContainer = $('#import')
  const createBtn = $('#create')
  const exportBtn = $('#export')
  const importAppendInput = $('#import-append')
  const importReplaceInput = $('#import-replace')

  const DEBOUNCE_THRESHOLD = 100
  let timeout = null

  function updateLocalStorage() {
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      browser.storage.local.set({ [__QW_STORAGE_KEY]: links })
    }, DEBOUNCE_THRESHOLD)
  }

  function checkDupes() {
    for (let i = 0; i < links.length; i++) {
      const name = links[i][0]
      const matchingNames = links
        .map(([currName], i) => [currName, i])
        .filter(([currName]) => currName === name)

      // mark all dupes
      // add 1 to indices because the headers are also in the container
      if (matchingNames.length > 1) {
        for (const [_, j] of matchingNames) {
          linksContainer.children
            .item(j + 1)
            .children.namedItem(INPUT_NAME_NAME)
            .classList.add(ERROR_CLASS)
        }
      } else {
        linksContainer.children
          .item(i + 1)
          .children.namedItem(INPUT_NAME_NAME)
          .classList.remove(ERROR_CLASS)
      }
    }
  }

  function checkInvalidUrls() {
    const linkRows = Array.from(linksContainer.children).slice(1)
    for (const item of linkRows) {
      const urlInput = item.children.namedItem(INPUT_URL_NAME)
      try {
        new URL(urlInput.value)
        urlInput.classList.remove(ERROR_CLASS)
      } catch {
        urlInput.classList.add(ERROR_CLASS)
      }
    }
  }

  function createRow(pair) {
    const nameInput = document.createElement('input')
    const urlInput = document.createElement('input')
    const delBtn = document.createElement('input')

    const row = document.createElement('div')
    row.classList.add(ROW_CLASS)
    row.append(nameInput, urlInput, delBtn)

    linksContainer.append(row)

    nameInput.value = pair[0]
    urlInput.value = pair[1]
    delBtn.value = 'x'

    nameInput.type = urlInput.type = 'text'
    delBtn.type = 'submit'

    nameInput.name = INPUT_NAME_NAME
    urlInput.name = INPUT_URL_NAME

    nameInput.placeholder = 'name...'
    urlInput.placeholder = 'url...'

    nameInput.addEventListener('input', function () {
      pair[0] = nameInput.value
      checkDupes()
      updateLocalStorage()
    })

    urlInput.addEventListener('input', function () {
      pair[1] = urlInput.value
      checkInvalidUrls()
      updateLocalStorage()
    })

    delBtn.addEventListener('click', function () {
      linksContainer.removeChild(row)
      links.splice(links.indexOf(pair), 1)
      checkDupes()
      updateLocalStorage()
    })
  }

  // initial render
  links.forEach(createRow)
  checkDupes()
  checkInvalidUrls()

  // row creation
  createBtn.addEventListener('click', function () {
    const pair = ['', '']
    createRow(pair)
    links.push(pair)
    updateLocalStorage()
  })

  // general links
  document.querySelectorAll('.nav').forEach((nav) =>
    nav.addEventListener('click', function (evt) {
      evt.preventDefault()
      browser.tabs.create({
        active: true,
        url: evt.target.href,
      })
    })
  )

  // export
  exportBtn.addEventListener('click', function (evt) {
    evt.preventDefault()
    browser.runtime.sendMessage({
      type: 'export',
      data: JSON.stringify(links),
    })
  })

  function cleanLinks(newLinks) {
    while (linksContainer.children.length > 1) {
      linksContainer.removeChild(linksContainer.children.item(1))
    }
    links = newLinks
    links.forEach(createRow)
  }

  // import
  function importLinks(evt, append) {
    const file = evt.target.files[0]
    const linksBackup = JSON.parse(JSON.stringify(links))
    file
      .text()
      .then(function (res) {
        const newLinks = JSON.parse(res)
        if (append) {
          // add new links to preexisting ones
          links.push(...newLinks)
          newLinks.forEach(createRow)
        } else {
          // destructive. replace all existing links with new ones
          cleanLinks(newLinks)
        }
        checkDupes()
        checkInvalidUrls()
        updateLocalStorage()
      })
      .catch(function (err) {
        console.error('Failed to import:', file, err)
        alert('Failed to import. See console for more details.')
        cleanLinks(linksBackup)
      })
  }

  if (window.location.hash === '#popup') {
    // firefox: tell users to open in new tab because popups close when the filepicker takes focus
    // chrome does not have this quirk
    importContainer.innerHTML = '<strong>[open in tab] to import</strong>'
  } else {
    importAppendInput.addEventListener('input', (evt) => importLinks(evt, true))
    importReplaceInput.addEventListener('input', (evt) => importLinks(evt, false))
  }
})()
