'use strict'

const express = require('express');

module.exports = {
  urls: require('./urls.js'),
  express: express,
  router: express.Router,
  bodyParser: require('body-parser'),
  chalk: require('chalk'),
  sequelize: require('sequelize'),
  pg: require('pg')
}
