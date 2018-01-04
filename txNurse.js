'use strict'

var request = require('request')
var cheerio = require('cheerio')

var TX_NURSE_URL = 'https://www.bon.texas.gov/forms/rnrslt.asp'

function txNurseLookup(license, callback) {
  var data = {
    LicNumber: license.toString(),
    SSNumber: null,
    DOB: null,
    firstname: null,
    lastname: null,
    B1: 'Submit'
  }

  request.post({ url: TX_NURSE_URL, form: data },
    function(error, response, body) {
      if (error !== null || response.statusCode !== 200) {
        callback(true, null)
        return
      }

      callback(null, parseResponse(body))
    }
  )
}

function parseResponse(body) {
  var $ = cheerio.load(body)
  var content = $('td.content')

  let nameElement = content.find('h2')
  if (nameElement.length === 0) {
    return null
  }

  var data = { 'Name': nameElement.text().trim() }

  content.find('ul li').each(function (index, item) {
    var text = $(item).text()
    var pairs = text.split(':')

    data[pairs[0]] = pairs[1].trim()
  })

  return data
}

module.exports = txNurseLookup
