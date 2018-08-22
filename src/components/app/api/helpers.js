export default {
  /**
   * Appends query parameters to a given API url
   * @param {String} url The API url.
   * @param {Object} queryParams The query parameters we're sending to axios.
   */
  appendQuery (url, queryParams) {
    let list = []

    for (let param in queryParams) {
      if (queryParams[param]) {
        list.push(encodeURIComponent(param) + '=' + encodeURIComponent(queryParams[param]))
      }
    }

    return url + '?' + list.join('&')
  }
}
