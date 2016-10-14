'use strict'
const db = require('../db/index.js')
const sequelize = db.sequelize;
const Article = db.article;
const RelatedTicket = db.relatedTicket;

module.exports = {
  pingDb (req, res) {
    sequelize.authenticate()
    .then(() => res.status(200).send(JSON.stringify('db connected')))
    .catch(err => res.status(503).send(JSON.stringify({name: 'PGSQL_CONN_FAIL', message: 'bad PostgreSQL connection'})));
  },
  getArticle(req, res) {
    let id = req.params.id ;
    let options = {
      include: [{
        model: RelatedTicket,
        as: 'relatedTickets'
      }]
    };
    if(id)
      options.where = {
        id: { $any: id.split(',').map(str => +str) }
      };
    Article.findAll(options)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(err => res.status(404).send(err));
  },
  createArticle(req, res) {
    let tickets = false;
    if(Array.isArray(req.body.relatedTickets)) {
      tickets = req.body.relatedTickets.slice();
      delete req.body.relatedTickets;
    }
    Article.create(req.body)
    .then(data => tickets ?
      RelatedTicket.bulkCreate(tickets.map(ticketId => ({
        articleId: data.id,
        ticketId: ticketId,
        id: `A${data.id}T${ticketId}`
      })))
      .then(() => sendRes(res, data.id))
      : sendRes(res, data.id))
    .catch(err => res.status(500).send(err));
  },
  editArticle(req, res) {
    let tickets = false;
    if(Array.isArray(req.body.relatedTickets)) {
      tickets = req.body.relatedTickets.map(ticketId => ({
        articleId: req.params.id,
        ticketId: ticketId,
        id: `A${req.params.id}T${ticketId}`
      }));
      delete req.body.relatedTickets;
    }
    Article.update(req.body, {where: {id: req.params.id}})
    .then(() => tickets ?
      RelatedTicket.destroy({where: {articleId: req.params.id}})
      .then(() => RelatedTicket.bulkCreate(tickets)
        .then(() => sendRes(res, req.params.id)))
      : sendRes(res, req.params.id))
    .catch(err => res.status(500).send(err));
  },
  deleteArticle(req, res) {
    Article.destroy({where: {id: req.params.id} })
    .then(deleted => deleted ?
      res.status(201).send('record deleted')
      : res.status(404).send('no record found'))
    .catch(err => res.status(500).send(err));
  },
  getRelations(req, res) {
    RelatedTicket.findAll({
      // include: [{
      //   model: Article,
      // //   attributes: ['authorId', 'product', 'customerId']
      // }]
    })
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(err => res.status(404).send(err));
  }
};

function sendRes(res, id) {
  Article.find({
    where: {id: id},
    include: [{
      model: RelatedTicket,
      as: 'relatedTickets'
    }]
  })
  .then(data => res.status(201).send(JSON.stringify([data])))
}
