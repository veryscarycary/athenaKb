'use strict'
const Sequelize = require('../config/middleware.js').Sequelize,
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
      unique: true
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
    //relatedTickets: handle in join table
    //relatedProducts: handle in join table , //Keys for product and versions
    authorId: STR,
    archived: BOOL,
    //datesEdited: [[String, String]], //dates edited, user Id HANDLE IN VER HISTORY
    dateLastViewed: DATE,
    viewCount: INT
  }
};
