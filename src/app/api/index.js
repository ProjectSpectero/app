import requestAPI from '@/api'

async function API (method, path, data, success, failed) {
  // Setting up the APP project
  requestAPI('APP', method, path, data, success, failed)
}

export default API
