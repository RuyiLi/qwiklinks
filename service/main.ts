import { parse } from 'https://deno.land/std@0.97.0/encoding/toml.ts'

interface Config {
  links: Record<string, string>
}

const configPath = './links.toml'
const port = 80
const hostname = '127.0.0.1'

let links = new Map()
async function loadConfig() {
  console.info('Loading configuration file...')

  const configRaw = await Deno.readTextFile(configPath)
  const config = parse(configRaw) as unknown as Config
  links = new Map(Object.entries(config.links))

  console.info(`Loaded ${links.size} links.`)
}

const server = Deno.listen({
  port,
  hostname,
  transport: 'tcp',
})

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn)
  for await (const evt of httpConn) {
    const url = new URL(evt.request.url)
    const [path, ...args] = url.pathname.slice(1).split('/')
    console.log(path, args)

    const link = links.get(path)
    if (typeof link === 'undefined') {
      await evt.respondWith(
        new Response('Quicklink not found.', { status: 404 })
      )
    } else {
      console.log('Found link', link)
      await evt.respondWith(
        new Response(null, {
          status: 302,
          headers: {
            location: encodeURI(link),
          },
        })
      )
    }
  }
}

loadConfig()
;(async function () {
  for await (const conn of server) {
    handle(conn)
  }
})()
;(async function () {
  const watcher = await Deno.watchFs(configPath)
  for await (const evt of watcher) {
    if (evt.kind === 'modify') {
      loadConfig()
    }
  }
})()
