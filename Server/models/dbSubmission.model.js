// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbSubmissionSchema = new Schema({
  submissionId: String,
  dbSessionId: String,
  rollNumber: String,
  score: Number,
  submissionTime: String,
  solvedQuestions: {
    type: Map,
    of: String,
  },
});

module.exports = mongoose.model("dbSubmission", dbSubmissionSchema);
