// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var skillUpSchema = new Schema({
	// weekId: String,
	rank: { type: Number, default: 0 },	
	rollNumber: String,
	leetCodeId: String,
	hackerRankId: String,
	codeChefId: String,
	codeForcesId: String,
	interviewBitId: String,
	spojId: String,
	geeksForGeeksId: String,
	leetCodeScore: { type: Number, default: 0 },
	hackerRankScore: { type: Number, default: 0 },
	codeChefScore: { type: Number, default: 0 },
	codeForcesScore: { type: Number, default: 0 },
	interviewBitScore: { type: Number, default: 0 },
	spojScore: { type: Number, default: 0 },
	geeksForGeeksScore: { type: Number, default: 0 },
	buildIT: { type: Number, default: 0 },
	overallScore: { type: Number, default: 0 },
});

module.exports = mongoose.model("SkillUp", skillUpSchema);
