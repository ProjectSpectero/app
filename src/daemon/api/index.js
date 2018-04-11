import requestAPI from '@/api'

async function API (method, path, data, success, failed) {
  // Setting up the DAEMON project
  requestAPI('DAEMON', method, path, data, success, failed)
}

export default API
