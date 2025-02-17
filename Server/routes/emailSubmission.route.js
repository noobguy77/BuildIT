let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const emailSubmission = require("../controllers/emailSubmission.controller.js");

  //create a submission
  app.post("/emailSubmission", middleware.checkToken, emailSubmission.create);

  //get all submissions of a question of a session
  app.get(
    "/emailSubmissions/:emailSubmissionId",
    middleware.checkToken,
    emailSubmission.findAllSession
  );

  //get one submission
  app.get(
    "/emailSubmission/:emailSubmissionId",
    middleware.checkToken,
    emailSubmission.findOne
  );

  //evaluate Submission and also can edit the evaluation
  app.post(
    "/emailSubmission/:emailSubmissionId/:rollNumber",
    middleware.checkToken,
    emailSubmission.evalSubmission
  );

  app.get(
    "/emailSubmissions/:emailSubmissionId/:rollNumber",
    middleware.checkToken,
    emailSubmission.findOneStatementRollNumber
  );

  app.get(
    "/emailAllSubmissions/:rollNumber",
    middleware.checkToken,
    emailSubmission.findAllRollNumber
  );
};
