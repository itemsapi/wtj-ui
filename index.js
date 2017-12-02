const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const morgan = require('morgan');
const service = require('./src/service');
const json2csv = require('json2csv');

var nunenv = require('./src/clients/nunenv')(app, 'views', {
  autoescape: true,
  watch: true,
  noCache: true
})

app.engine('html.twig', nunenv.render);
app.enable('trust proxy');
app.set('view engine', 'html.twig');
app.set('view cache', false);

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

app.get(['/'], function(req, res, next) {
  return res.render('start');
})

/**
 * process data
 */
app.post(['/'], function(req, res, next) {

  return service.inputToJSON(req.body.body)
  .then(r => {

    console.log('Processing ' + r.length + ' urls');
    return service.processDomains(r)
  })
  .then(r => {

    var csv = json2csv({
      data: r
    });

    //console.log(csv);

    return res.render('start', {
      csv: csv,
      json: r
    });
  })

  service.processDomains(list)
  .then(r => {
    console.log(r.length);

    var csv = json2csv({
      data: r
    });

    //console.log(csv);

    return res.render('start', {
      csv: csv,
      json: r
    });
  })
})

app.listen(PORT, function () {
  console.log('Your app listening on port %s!', PORT);
});
