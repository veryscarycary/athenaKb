'use strict'
const mw = require('../config/middleware.js');
const uri = mw.urls.database;
const chalk = mw.chalk;
const schema = require('./schema.js');
const DEFAULT_DATA = require('../data/default.json');

let sequelize = module.exports.sequelize = new mw.Sequelize(uri, {
  logging: false //set true to see SQL in terminal
});

let Article = module.exports.article =
  sequelize.define('article', schema.article);

//----server initialization----
//server will overwrite defaults each time its launched
sequelize.authenticate()
  .then(() => {
    let updates = 0,
    inserts = 0,
    errors = 0,
    done = 0;
    function loadCheck (a, err, inserted) {
      err ?
        errors++
        : inserted ?
          inserts++
          : updates++;
      ++done == a.length && console.log(chalk.green(`Load complete.`) + chalk.magenta(` ${done - errors} records loaded: ${inserts} insert${inserts != 1 ? 's' : ''}, ${updates} update${updates != 1 ? 's' : ''}.`) + (errors ? chalk.red(`\n${errors} error${errors != 1 ? 's' : ''}.`) : ''));
    }
    console.log(chalk.green('Database connected.') + chalk.cyan('\nLoading default data...'));
    Article.sync()
    .then(()=> DEFAULT_DATA.forEach((jsonItem, i, a) =>
      Article.upsert(jsonItem)
        .then(inserted => loadCheck(a, null, inserted))
        .catch(err => loadCheck(a, err)))
    );
  })
  .catch(err => console.log(chalk.red(err.name + ' ' + err.message)));
