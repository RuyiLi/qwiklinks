<p align="center">

[Homepage](https://ruyili.ca/qwiklinks/) | [GitHub](https://github.com/RuyiLi/qwiklinks)

[Firefox Addon](https://addons.mozilla.org/en-CA/firefox/addon/qwiklinks/) |
[Chrome/Edge Extension](https://chrome.google.com/webstore/detail/qwiklinks/leahklkmdooljnnljcheihjjcligjbmc)

</p>

# qwiklinks

<p><img align="right" src="assets/icons/qw-128.png" alt="qwiklinks Logo" /></p>
Access long URLs with short, easy-to-remember names.

<br><br><br><br>

## Demo

https://ruyili.ca/qwiklinks/assets/demo.mp4

## Why

**qwiklinks** was built as a way to help people get around in their browser faster. Instead of having to memorize URL prefixes or randomly typing in keywords until the search bar autocompletes the URL, you can simply associate the URL with a short and memorable name. In a sense, qwiklinks are similar to bookmarks, but don't require you to use your mouse, take up no screen space, and don't force you to sift through a sea of bookmarks to find the one you're looking for.

If you've used [GoLinks](https://www.golinks.io/), you can think of it as a "personal" alternative to their product. For a more in-depth explanation of the benefits over using bookmarks, see their website and [blog post](https://www.golinks.com/blog/how-to-save-links-the-better-alternative-to-bookmarks/) for resources written by those much more proficient in the ways of persuasion than I.

## Usage

You can use qwiklinks either through an extension on your browser, or as a background service on your local machine (latter is not recommended for now).

## Extension

The qwiklinks extension allows you to access your links through the browser search bar. Simply type `qw <name>` and hit enter to load the corresponding URL. A list of suggestions matching what you currently have typed will appear as you type the name.

<p align="center">
  <img src="assets/suggest.png" alt="qwiklinks Search" width="600"/>
</p>

### Installation

- [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/qwiklinks/)
- [Chrome/Edge](https://chrome.google.com/webstore/detail/qwiklinks/leahklkmdooljnnljcheihjjcligjbmc)

### Arguments

You can specify arguments by inserting placeholders such as $1, $2, and $3 in your URL. To use these placeholders, simply type the arguments after the qwiklink name, separated by spaces; for instance, `qw mail 0` replaces all occurences of `$1` in the "mail" qwiklink URL with `0`.

<p>
<img align="right" src="assets/popup.png" alt="qwiklinks Extension Popup" width="300"/>
</p>

### Dashboard

The qwiklinks extension provides a dashboard to manage your links.

1. Click the extension icon on the browser toolbar
2. Use the `_dash` qwiklink (`qw _dash`)
3. Open the extension's options page.

### Errors

If you see a red outline around your field

- A red outline on a name field indicates that it is a duplicate.
  - In the case of duplicate names, qwiklinks will use the first one.
- A red outline on a url field indicates that it is an invalid URL. Note that most URLs have to start with a valid protocol, like `https://`

### Import/Export

You can export your links to a file, which can then be shared across browsers or with other users through the import options. On Firefox, the import options will only appear when the dashboard is open in its own tab (due to some limitations of popups for security reasons).

There are two types of import options:

- `[append]` will add all of the new links on top of your existing ones, so you won't lose anything.
- `[replace]` is a **destructive** action. It will override all of your existing links and replace them with the new ones. Take care when using this option (TODO prompt?)

### Roadmap

- [x] Arguments ($1, $2, ...)
  - [ ] Default arguments
- [x] Autosuggest
- [x] Export and import (append/replace)
- [ ] Themes
- [x] Make help? less sketchy
- [ ] Switch scripts to deno/node?

### Development

Development is done Firefox-first, with the Chromium code being generated using `scripts/pkg-chromium.sh`. The codebases for the two extensions are practically identical, with a few differences.

- The Firefox extension uses Manifest V2, while the Chromium one uses V3
- The browser APIs for Firefox use the `browser` namespace, while Chromium uses `chrome`. `chrome` should also work in Firefox, but just to be safe, I'll stick with `browser` for the time being

### Scripts

All scripts live in the `scripts/` directory. You can run `chmod +x scripts/*.sh` to allow direct execution.

- `copy-icons` copies the icons from the `assets/` folder to the unpacked extension directories.
- `pkg-${browser}` builds the packed extension for the specified browser.
- `pkg-all` does the same as above but for all supported browsers

## Background Service

> Use of this is not recommended for now. Unless there's demand for this, development will be on hiatus. It's missing a lot of features and is also a hassle to set up relative to the browser extensions.

Enables browser-agnostic link redirection through the `qw/` prefix.

### Setup

- Ensure localhost port 80 is free.
- Add `127.0.0.1 qw` to your hosts file.
- Install [deno](https://deno.land/).
- Generate the binary by running `deno compile --allow-read --allow-net --output qwiklinks service/main.ts`.
- Run it with elevated permissions (e.g. `sudo /path/to/qwiklinks`)

### Roadmap

- [ ] Arguments ($1, $2, ...)
- [ ] Web dashboard to manage links
- [ ] Export and import links
- [x] Hot reload links.toml
