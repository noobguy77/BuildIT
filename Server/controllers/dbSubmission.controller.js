const DBSub = require("../models/dbSubmission.model.js");
const sqlCon = require("./sqlDBConnector.js");
var moment = require("moment");

const executeQueries = async (queries, tableName, rollNumber) => {
  queries = queries.split("/*");
  queries.pop();
  let results = [];
  for (let query of queries) {
    query = query.replace(tableName, tableName + rollNumber);
    try {
      const result = await new Promise((resolve, reject) => {
        sqlCon.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      results.push(result);
    } catch (err) {
      console.error(err);
      return { success: false, data: err };
    }
  }
  return { success: true, data: results };
};

function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

exports.create = async (req, callback) => {
  sqlCon.query(
    "CREATE TABLE " +
      req.body.tableName +
      req.body.rollNumber +
      " AS SELECT * FROM " +
      req.body.tableName,
    async (err, result) => {
      if (err) {
        return callback(
          "Some error occurred while retrieving solution table for the question." +
            req.body.questionId,
          null
        );
      } else {
        let queryRes = await executeQueries(
          req.body.sqlCode,
          req.body.tableName,
          req.body.rollNumber
        );
        console.log(queryRes.data.slice(-1)[0], "this is result");
        if (!queryRes.success) {
          sqlCon.query(
            "DROP TABLE " + req.body.tableName + req.body.rollNumber,
            function (err2, result2) {
              return callback(
                "Some error occurred while retrieving solution table for the question." +
                  req.body.questionId,
                null
              );
            }
          );
        } else {
          var result1 = queryRes.data.slice(-1)[0];
          //drop the table
          sqlCon.query(
            "DROP TABLE " + req.body.tableName + req.body.rollNumber,
            function (err2, result2) {
              if (err2) {
                return callback(
                  "Some error occurred while dropping user table for the question." +
                    req.body.questionId,
                  null
                );
              } else {
                if (req.body.submit) {
                  var score = 0;
                  let encoded = req.body.questionHiddenOutput;
                  questionHiddenOutput = decodeEntities(encoded);
                  if (questionHiddenOutput === JSON.stringify(result1)) {
                    score = Number(score) + Number(req.body.score);
                  }
                  let sessId;
                  if (req.body.dbSessionId) {
                    sessId = req.body.dbSessionId;
                  } else {
                    sessId = "dbPractice";
                  }
                  DBSub.findOne({
                    submissionId: sessId + req.body.rollNumber.toLowerCase(),
                  })
                    .then((dbSubmission) => {
                      if (dbSubmission) {
                        let upMap = dbSubmission.solvedQuestions;
                        var upscore;
                        if (upMap.get(req.body.questionId)) {
                          upscore = dbSubmission.score;
                        } else {
                          upscore = dbSubmission.score + score;
                        }
                        upMap.set(req.body.questionId, req.body.sqlCode);
                        DBSub.findOneAndUpdate(
                          {
                            submissionId:
                              sessId + req.body.rollNumber.toLowerCase(),
                          },
                          {
                            $set: {
                              score: upscore,
                              solvedQuestions: upMap,
                            },
                          },
                          { new: true }
                        )
                          .then((data) => {
                            if (score == 0) {
                              state = false;
                            } else {
                              state = true;
                            }
                            resultsData = {
                              data: data,
                              results: queryRes.data.slice(-1),
                              state: state,
                            };
                            return callback(null, resultsData);
                          })
                          .catch((err) => {
                            return callback(
                              "Error occurred while Submitting.(DB)",
                              null
                            );
                          });
                      } else {
                        var map = new Map();
                        map.set(req.body.questionId, req.body.sqlCode);
                        const submission = new DBSub({
                          submissionId:
                            sessId + req.body.rollNumber.toLowerCase(),
                          dbSessionId: sessId,
                          rollNumber: req.body.rollNumber.toLowerCase(),
                          score: Number(score),
                          submissionTime: new Date(),
                          solvedQuestions: map,
                        });
                        submission
                          .save()
                          .then((data) => {
                            // console.log(data);
                            if (score == 0) {
                              state = false;
                            } else {
                              state = true;
                            }
                            resultsData = {
                              data: data,
                              results: queryRes.data.slice(-1),
                              state: state,
                            };
                            return callback(null, resultsData);
                          })
                          .catch((err) => {
                            return callback(
                              "Error occurred while Submitting.(DB)",
                              null
                            );
                          });
                      }
                    })
                    .catch((err) => {
                      return callback(
                        "Error occurred while Submitting.(DB)",
                        null
                      );
                    });
                } else {
                  resultsData = {
                    data: null,
                    results: queryRes.data.slice(-1),
                  };
                  return callback(null, resultsData);
                }
              }
            }
          );
        }
      }
    }
  );
};
