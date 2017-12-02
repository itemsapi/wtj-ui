var nunjucks = require('nunjucks');

/**
 * template engine
 */
module.exports = function(app, path, options) {

  var nunenv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path, options)
  )

  nunenv.express(app);
  return nunenv;
}
