'use strict'
const db = require('../db/index.js')
const sequelize = db.sequelize;
const Article = db.article;

module.exports = {
  pingDb (req, res) {
    sequelize.authenticate()
    .then(() => res.status(200).send(JSON.stringify('db connected')))
    .catch(err => res.status(503).send(JSON.stringify({name: 'PGSQL_CONN_FAIL', message: 'bad PostgreSQL connection'})));
  },
  getArticle(req, res) {
    var id = req.params.id ;
    var options = id ?
      { where: { id: { $any: id.split(',').map(str => +str) }}}
      : {};
    Article.findAll(options)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(err => res.status(404).send(err));
  },
  createArticle(req, res) {
    Article.create(req.body)
    .then(data => res.status(201).send(JSON.stringify(data)))
    .catch(err => res.status(500).send(err));
  },
  editArticle(req, res) {
    var options = {where: {id: req.params.id} };
    Article.update(req.body, {where: {id: req.params.id} })
    .then(() => Article.find(options)
      .then(data => res.status(201).send(JSON.stringify(data))))
    .catch(err => res.status(500).send(err));
  },
  deleteArticle(req, res) {
    Article.destroy({where: {id: req.params.id} })
    .then(deleted => deleted ?
      res.status(201).send('record deleted')
      : res.status(404).send('no record found'))
    .catch(err => res.status(500).send(err));
  }
};
