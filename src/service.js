const wtj = require('website-to-json');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports.processDomains = function(list) {

  return Promise.all(list)
  .map(v => {

    return wtj.extractData(v, {
      links: false,
      forever: false,
      debug: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      },
      timeout: 30000,
      time: false,
      emails: false
    })
    .then(result => {
      return {
        domain: v,
        title: result.meta.title,
        keywords: result.meta.keywords,
        linkedin: result.social.linkedin,
        facebook: result.social.facebook,
        pinterest: result.social.pinterest,
        youtube: result.social.youtube,
        instagram: result.social.instagram,
        description: result.meta.description,
        url: result.url,
      };
    })
    .then(r => {
      console.log(v + ' ok')
      console.log(r)
      return r;
    })
    .catch(e => {
      console.log(v + ' ' + e.message)
      return;
    })
  }, {
    concurrency: 3
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
