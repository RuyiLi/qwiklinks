# qwiklinks

<p><img align="right" src="firefox/icons/qw-128.png" alt="qwiklinks Logo" /></p>
Access long URLs with short, easy-to-remember names.

## Usage

You can use qwiklinks either through an extension on your browser, or as a background service on your local machine.

---

## Extension

<div>
<p><img align="right" src="assets/suggest.png" alt="qwiklinks Logo" width="300"/></p>

The qwiklinks extension allows you to access your links through the browser search bar (for developers, see [omnibox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/omnibox)). Simply type `qw <name>` and hit enter to load the corresponding URL. A list of suggestions matching what you currently have typed will appear as you type the name.

You can specify arguments by inserting placeholders in the form of `$D` in your URL, where `D` is some number between 1 and 9 inclusive. You can then specify arguments by inserting a space after your qwiklink name. For example, to navigate to the "/r/all" subreddit in the below image, one would type `qw r all` into the searchbar. All instances of `$1` in the URL will be replaced by `all`.

</div>

<div>
<p><img align="right" src="assets/popup.png" alt="qwiklinks Logo" width="300"/></p>
The qwiklinks extension provides a dashboard to manage your links. This dashbaord is accessible by clicking the qwiklinks extension through the toolbar or through the options page (Extensions > Manage Extensions > Ellipsis on qwiklinks > Options).
</div>

### Installation

- [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/qwiklinks/)

### Roadmap

- [x] Arguments ($1, $2, ...)
  - [ ] Default arguments
- [ ] Web dashboard to manage links
- [x] Autosuggest
- [ ] Export and import (append/replace)
- [ ] Themes
- [ ] Make help? less sketchy
- [ ] An actual homepage, so users don't have to read this mess I just wrote up
- [ ] Switch scripts to deno/node?

---

## Service

> For now, use of the service is not recommended. It is missing a few features and is a hassle to set up relative to the browser extensions.

Enables browser-agnostic link redirection through the `qw/` prefix.

### Setup

- Ensure localhost port 80 is free.
- Add `127.0.0.1 qw` to your hosts file.
- Install [deno](https://deno.land/).
- Generate the binary by running `deno compile --allow-read --allow-net --output qwiklinks service/main.ts`.
- Execute the compiled binary with elevated permissions (e.g. `sudo /path/to/qwiklinks`)

### Roadmap

- [ ] Arguments ($1, $2, ...)
- [ ] Web dashboard to manage links
- [ ] Export and import links
- [x] Hot reload links.toml
