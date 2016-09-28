'use strict'
const mongoose = require('../config/middleware.js').mongoose;

module.exports = mongoose.model('Kb', new mongoose.Schema(
    {
      title: {
        type:String,
        unique: true
      },
      id: String,
      issuePreview: String,
      issue: String,
      solution: String,
      relatedTickets: [String],
      relatedProducts: [String], //Keys for product and versions
      authorId: String,
      archived: Boolean,
      datesEdited: [[String, String]], //dates edited, user Id
      dateSubmitted: String,
      dateLastViewed: String,
      viewCount: Number,
      checkedOut: Boolean
    },
    {  versionKey: false }
));
