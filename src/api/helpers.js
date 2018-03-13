export default {
  /**
   * Appends query parameters to a given API url
   * Possible parameters are:
   *
   * page: The page we want to fetch.
   * limit: The perPage results.
   *
   * @param {String} url The API url.
   * @param {Object} options The options we're sending to axios.
   */
  appendQuery (url, options) {
    const limit = options.limit || '10'
    const page = options.page || '1'

    return url + '?page=' + page + '&perPage=' + limit
  }
}
