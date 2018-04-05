import router from '../router'

export default {
  /**
   * Appends query parameters to a given API url
   * Possible parameters are:
   *
   * page: The page we want to fetch.
   * limit: The perPage results.
   * keepURL (optional, defaults to false): wether to keep the URL as
   *     change it with page number
   *
   * @param {String} url The API url.
   * @param {Object} options The options we're sending to axios.
   */
  appendQuery (url, options) {
    let limit = options.limit || '10'
    let page = options.page || '1'
    let query = `?page=${page}&perPage=${limit}`

    if (options.includeGrouped) {
      query += `&includeGrouped=${options.includeGrouped}`
    }

    if (options.searchId !== undefined && options.searchId) {
      query += `&searchId=${options.searchId}`
    }

    // Update page (only with the page to prevent limit spamming)
    if (options.keepURL === undefined || !options.keepURL) {
      this.appendPage(page)
    }

    return url + query
  },

  /**
   * Updates the current named route with a given page parameter.
   *
   * @param {Object} page The page we're going to
   */
  appendPage (page) {
    let params = Object.assign({}, router.history.current.params)
    params.page = page

    router.push({ name: router.history.current.name, params: params })
  }
}
