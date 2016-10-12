'use strict'
const mw = require('../config/middleware.js');
const uri = mw.urls.database;
const chalk = mw.chalk;
const schema = require('./schema.js');
const DEFAULT_DATA = require('../data/default.json');

let sequelize = module.exports.sequelize = new mw.sequelize(uri, {
  logging: false //set true to see SQL in terminal
});

let Article = module.exports.article =
  sequelize.define('article', schema.article);
let RelatedTicket = module.exports.relatedTicket =
  sequelize.define('related_ticket', schema.relatedTicket);
Article.hasMany(RelatedTicket, {as: 'relatedTickets', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
//----server initialization----
//server will overwrite defaults each time its launched
sequelize.authenticate()
  .then(() => {
    let conflicts = 0,
    creations = 0,
    errors = 0,
    done = 0;
    console.log(chalk.green('Database connected.') + chalk.cyan('\nLoading default data...'));
    Article.sync({force: true})
    .then(() =>
      RelatedTicket.sync({force: true})
      .then(()=> Promise.all(DEFAULT_DATA.map((jsonItem, i, a) => {
        let tickets = [];
        if(Array.isArray(jsonItem.relatedTickets)) {
          tickets = jsonItem.relatedTickets.slice();
          delete jsonItem.relatedTickets;
        }
        return Article.create(jsonItem)
        .then(data => RelatedTicket.bulkCreate(tickets.map(ticketId => ({
          articleId: data.id,
          ticketId: ticketId,
          id: `A${data.id}T${ticketId}`
        })))
      )})).then(loads => console.log(chalk.green(`Load complete. `) + chalk.magenta(`${loads.length} records loaded.`))))
    );
  })
  .catch(err => console.log(chalk.red(err.name + ' ' + err.message)));
