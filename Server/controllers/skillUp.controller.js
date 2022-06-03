const SkillUp = require("../models/skillUp.model.js");
// const WeekSkill = require("../models/weekSkill.model.js");
const inarray = require("inarray");
// const xlsx = require("xlsx");

exports.create = (req,res) => {
    SkillUp
    //findOneAndUpdate creates a new Doc if query is not found or updates the existing if found
    .findOneAndUpdate(
        { rollNumber: req.body.rollNumber },
        {
            $set: {
                rollNumber : req.body.rollNumber,
                hackerRankId: req.body.hackerRankId,
                codeChefId: req.body.codeChefId,
                codeForcesId: req.body.codeForcesId,
                interviewBitId: req.body.interviewBitId,
                spojId: req.body.spojId,
                geeksForGeeksId: req.body.geeksForGeeksId,
                leetCodeId: req.body.leetCodeId,
            },
        },
        { upsert: true }
    )
    .then((skillUp) => {
        res.status(200).send(skillUp);
    })
    .catch((err) => {
        return res.status(500).send({
            success: false,
            message: "Error Occured with  " + req.body.rollNumber,
        });
    });
}

exports.update = (req,res) => {
    SkillUp.updateMany(
        {},
        {$set:{
            
        }}
    )
}

exports.findAll = (req, res) => {
    SkillUp.find()
    .then((skillUps) => {
        res.send(skillUps);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while retrieving skillUps.",
      });
    });
};
