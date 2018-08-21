import requestAPI from '@/api'
import { getCookie } from 'tiny-cookie'

async function API (method, path, data, success, failed) {
  // Setting up the proper axios path for app interaction works as follows:
  // 1) If you specify app params on the config build file, those will be used across the app
  // 2) If you don't specify certain (or all) params, defaults will kick in.
  //    This means url will be derived from where we're at, protocol too. However, port is a bit different:
  // 2.1) If no port is specified, defaults to the current url port (8080, etc.)
  // 2.2) If a port is specified on our config BUT that port is '', we'll run the app using only the ip address
  // 2.3) If a port is specified and numeric, that will be used as expected

  const cookieName = process.env.APP_COOKIE
  const port = process.env.APP_PORT
  const cookie = getCookie(cookieName)
  let parsedPort = location.port ? ':' + location.port : ''

  // Allowing a default empty port to be specified
  if (port !== undefined) {
    parsedPort = (port !== 'null') ? ':' + port : ''
  }

  let project = {
    cookieName: cookieName,
    cookie: (cookie !== null) ? JSON.parse(cookie) : null,
    protocol: 'https://',
    port: parsedPort,
    endpoint: process.env.APP_ENDPOINT ? process.env.APP_ENDPOINT : location.hostname,
    version: process.env.APP_VERSION,
    timeout: 10000
  }

  await requestAPI(project, method, path, data, success, failed)
}

export default API
