// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbQuestionSchema = new Schema({
  questionId: String,
  questionName: String,
  dbSessionId: String,
  questionDescriptionText: String,
  questionSchema: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  questionExampleInput: String,
  questionExampleOutput: String,
  questionHiddenOutput: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  questionExplanation: String,
  score: Number,
  difficulty: String,
  author: String,
  editorial: String,
  tableName: String,
  tableData: Object,
  CountValue: Number,
});

module.exports = mongoose.model("DbQuestion", dbQuestionSchema);
