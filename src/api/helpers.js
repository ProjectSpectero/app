export default {
  /**
   * Appends a pagination parameter to a given API url
   * @param {String} url The API url.
   * @param {Object} options The options we're sending to axios.
   */
  appendPage (url, options) {
    const page = options.page || '1'
    return url + '?page=' + page
  }
}
