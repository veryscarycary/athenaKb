'use strict'

const express = require('express');

module.exports = {
  urls: require('./urls.js'),
  express: express,
  router: express.Router,
  Sequelize: require('sequelize'),
  bodyParser: require('body-parser'),
  chalk: require('chalk'),
  sequelize: require('sequelize'),
  pg: require('pg')
}
