import requestAPI from '@/api'
import { getCookie } from 'tiny-cookie'
import store from '@/store'

async function API (method, path, data, success, failed) {
  // Setting up the DAEMON project
  const cookieName = process.env['DAEMON_COOKIE']
  let project = {
    cookieName: cookieName,
    cookie: (getCookie(cookieName) !== null) ? JSON.parse(getCookie(cookieName)) : null,
    protocol: store.getters['daemonAuth/protocol'] ? store.getters['daemonAuth/protocol'] + '://' : location.protocol + '//',
    port: store.getters['daemonAuth/port'] ? ':' + store.getters['daemonAuth/port'] : '',
    endpoint: store.getters['daemonAuth/ip'] ? store.getters['daemonAuth/ip'] : location.hostname,
    version: store.getters['daemonAuth/version']
  }

  await requestAPI(project, method, path, data, success, failed)
}

export default API
