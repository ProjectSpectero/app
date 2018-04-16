class Err {
  constructor (data) {
    this.parse(data)
  }

  /**
   * Parser for error data returned from API.
   *
   * Used to parse error fields, for instance: `FIELD_MAXLENGTH:authKey:50` decodes to
   * a FIELD_MAXLENGTH error on the authKey field, with a max allowed length of 50.
   *
   * Note: error keys may contain more than one error, this function will return an array
   * of keys, with an array of error fields (if any) within each key.
   *
   * @param {String} data Data string from error passed from API.
   */
  parse (data) {
    let errors = {}
    let fields = {}

    // Data is Array[] of error keys (keys w/ no additional data)
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        errors[data[i]] = {}
      }
    } else { // Data is Object{} with keys as error keys, values as additional info to those error keys
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          let err = []

          for (let i = 0; i < data[key].length; i++) {
            let e = data[key][i].split(':')

            err.push({
              key: e[0],
              field: e[1],
              data: e[2]
            })

            if (e[1] !== undefined) {
              if (fields[e[1]] === undefined) {
                fields[e[1]] = {}
              }
              fields[e[1]][e[0]] = e[2] !== undefined ? e[2] : null
            }
          }
          errors[key] = err
        }
      }
    }
    this.errors = errors
    this.fields = fields
  }

  data () {
    return {
      errors: this.errors,
      fields: this.fields
    }
  }
}

export default Err
