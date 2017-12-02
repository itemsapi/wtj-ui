const wtj = require('website-to-json');
const _ = require('lodash');
const Promise = require('bluebird');
const c2j = require('csvtojson');

/**
 * array of domains objects all of them containing url field
 */
module.exports.processDomains = function(list) {

  //console.log('list')
  //console.log(list)

  return Promise.all(list)
  .map(v => {

    if (!v.url) {
      //return Promise.reject('URL is required');
      return v;
    }

    var url = module.exports.normalizeUrl(v.url)
    return wtj.extractData(url, {
      links: false,
      forever: false,
      debug: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      },
      timeout: 4000,
      time: false,
      emails: false
    })
    .then(result => {

      v = _.merge(v, {
        meta_title: result.meta.title,
        meta_keywords: result.meta.keywords,
        linkedin: result.social.linkedin,
        facebook: result.social.facebook,
        pinterest: result.social.pinterest,
        youtube: result.social.youtube,
        instagram: result.social.instagram,
        meta_description: result.meta.description,
      });

      return v;
    })
    .then(r => {
      console.log(v.url + ' ok')
      //console.log(r)
      return r;
    })
    .catch(e => {

      console.log('error: ' + v.url + ' ' + e.message)
      return v;
    })
  }, {
    concurrency: 10
  })
  .then(result => {
    return _.chain(result).filter(v => {
      return !!v;
    }).value()
  })
}

exports.normalizeUrl = function(url) {

  url = url.replace(/((http|https):\/\/)?(www.)?/, '')
  url = url.replace(/\/$/, '')
  return url
}

/**
 * return json as promise
 */
module.exports.csvToJson = function(text) {

  return new Promise(function (resolve, reject) {
    c2j({
      noheader:false,
      delimiter: [',', ';']
    })
    .fromString(text)
    .on('json', (json) => {
    })
    .on('end_parsed', (json) => {
      return resolve(json);
    })
    .on('done', () => {
    })
  });
}

/**
 * return json as promise
 */
module.exports.inputToJSON = function(text) {

  var lines = text.split('\r\n');
  var list = [];

  console.log(lines[0])

  // it's csv
  // should find a better way to detect csv
  if (lines[0].length > 40) {

    return module.exports.csvToJson(text);

    // it's a list of url's
  } else {

    return Promise.resolve(_.chain(text)
      .split('\r\n')
      .filter(v => {
        return !!v;
      })
      .map(v => {
        return {
          url: v
        };
      })
      .value());
  }
}
