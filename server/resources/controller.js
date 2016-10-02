'use strict'
const mw = require('../config/middleware.js');
const request = mw.request;
const url = mw.urls.database;
const Kb = require('./schema.js');

module.exports = {
  pingDb (req, res) {
    require('../db/index.js').readyState ?
      res.status(200).send(JSON.stringify('db connected'))
      : res.status(503).send(JSON.stringify({name: 'MONGO_CONN_FAIL', message: 'bad MongoDB connection'}
      ));
  },
  getStubs(req, res) {
    //return stubs. this will be how the kb search service updates
  },
  getArticle(req, res) {
    console.log('made it to getArticle');
    let id = req.params.id;
    Kb.find(id ? {id: req.params.id} : {},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(JSON.stringify(data))
    );
  },
  getArticlesByIds(req, res) {
    let ids = req.body.ids;
    console.log(ids, 'IDS INCOMING TO KBSERVER');
    return Promise.all(ids.map(item => {
      return Kb.find({id: item})
        .then(result => {
          return result[0];
        })
    }))
      .then(arr => {
        console.log(arr, 'array from KB server')
        res.status(200).send(JSON.stringify(arr))
      })
      .catch(err => {
        console.log(err);
        res.status(404).send(err);
      })
  },
  createArticle(req, res) {
    new Kb(req.body)
      .save((err, data) => err ?
        res.status(500).send(err)
        : res.status(201).send(JSON.stringify(data))
      );
  },
  editArticle(req, res) {
    Kb.findOneAndUpdate({_id: req.params.id},
      req.body,
      {new: true},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(JSON.stringify(data))
    );
  },
  deleteArticle(req, res) {
    Kb.remove({_id: req.params.id},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(JSON.stringify(data))
    );
  }
};
