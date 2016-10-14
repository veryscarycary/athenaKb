'use strict'
const Sequelize = require('../config/middleware.js').sequelize,
STR = Sequelize.STRING, //varchar(255)
BOOL = Sequelize.BOOLEAN, //tinyint(1)
DATE = Sequelize.DATE, //Timestamp with time zone
INT = Sequelize.INTEGER, //tinyint(1)
TXT = Sequelize.TEXT, //text
ENUM = Sequelize.ENUM; //enumerated

module.exports = {
  article: {
    title: {
      type: STR,
      unique: true,
      required: true
    },
    id: {
      type: INT,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    issuePreview: STR,
    issue: TXT,
    solution: TXT,
    product: STR,
    authorId: STR,
    archived: {
      type:BOOL,
      defaultValue:false
    },
    status: {
      type: ENUM,
      values: ['active', 'checked out', 'archived'],
      defaultValue: 'active'
    },
    dateLastViewed: DATE,
    viewCount: {
      type: INT,
      defaultValue: 1
    },
    useCount: INT
  },

  relatedTicket: {
    id: {
      type: STR,
      required: true,
      primaryKey: true
    },
    ticketId: INT
  }
};
