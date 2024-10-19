'use strict'
const DB_AUTH = require('./dbAuth.js');

const DIALECT = 'postgres';
const HOST = 'localhost';
const PORT = 5432;
const DB = 'kb';
const DB_USR = process.env.DB_USR || DB_AUTH.DB_USR;
const DB_PASS = process.env.DB_PASS || DB_AUTH.DB_PASS;

module.exports = {
  default: 3003,
  database: `${DIALECT}://${DB_USR}:${DB_PASS}@${HOST}:${PORT}/${DB}`
};
