//express is the framework we're going to use to handle requests
const express = require("express");

//Access the connection to Heroku Database
const pool = require("../utilities").pool;

const validation = require("../utilities").validation;
let isStringProvided = validation.isStringProvided;

const generateHash = require("../utilities").generateHash;
const generateSalt = require("../utilities").generateSalt;

const sendEmail = require("../utilities").sendEmail;

const router = express.Router();

/**
 * @api {post} /auth Request to register a user
 * @apiName PostAuth
 * @apiGroup Auth
 *
 * @apiParam {String} first a users first name
 * @apiParam {String} last a users last name
 * @apiParam {String} email a users email *unique
 * @apiParam {String} password a users password
 * @apiParam {String} [username] a username *unique, if none provided, email will be used
 *
 * @apiParamExample {json} Request-Body-Example:
 *  {
 *      "first":"Charles",
 *      "last":"Bryan",
 *      "email":"cfb3@fake.email",
 *      "password":"test12345"
 *  }
 *
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {String} email the email of the user inserted
 *
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 *
 * @apiError (400: Username exists) {String} message "Username exists"
 *
 * @apiError (400: Email exists) {String} message "Email exists"
 *
 * @apiError (400: Other Error) {String} message "other error, see detail"
 * @apiError (400: Other Error) {String} detail Information about th error
 *
 */
router.post(
  "/",
  (request, response, next) => {
    request.body.username = isStringProvided(request.body.username)
      ? request.body.username
      : request.body.email;

    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if (
      isStringProvided(request.body.first) &&
      isStringProvided(request.body.last) &&
      isStringProvided(request.body.username) &&
      isStringProvided(request.body.email) &&
      isStringProvided(request.body.password)
    ) {
      next();
    } else {
      response.status(400).send({
        message: "Missing required information",
      });
    }
  },
  (request, response, next) => {
    //We're storing salted hashes to make our application more secure
    //If you're interested as to what that is, and why we should use it
    //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
    let salt = generateSalt(32);
    let salted_hash = generateHash(request.body.password, salt);

    //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
    //If you want to read more: https://stackoverflow.com/a/8265319
    let theQuery =
      "INSERT INTO MEMBERS(FirstName, LastName, Username, Email) VALUES ($1, $2, $3, $4) RETURNING Email, MemberID";
    let values = [
      request.body.first,
      request.body.last,
      request.body.username,
      request.body.email,
    ];
    pool
      .query(theQuery, values)
      .then((result) => {
        //stash the memberid into the request object to be used in the next function
        request.memberid = result.rows[0].memberid;
        next();
      })
      .catch((error) => {
        //log the error
        // console.log(error)
        if (error.constraint == "members_username_key") {
          response.status(400).send({
            message: "Username exists",
          });
        } else if (error.constraint == "members_email_key") {
          response.status(400).send({
            message: "Email exists",
          });
        } else {
          console.log(error);
          response.status(400).send({
            message: "other error, see detail",
            detail: error.detail,
          });
        }
      });
  },
  (request, response) => {
    //We're storing salted hashes to make our application more secure
    //If you're interested as to what that is, and why we should use it
    //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
    let salt = generateSalt(32);
    let salted_hash = generateHash(request.body.password, salt);

    let theQuery =
      "INSERT INTO CREDENTIALS(MemberId, SaltedHash, Salt) VALUES ($1, $2, $3)";
    let values = [request.memberid, salted_hash, salt];
    pool
      .query(theQuery, values)
      .then((result) => {
        //We successfully added the user!
        response.status(201).send({
          success: true,
          email: request.body.email,
        });
        sendEmail(
          "our.email@lab.com",
          request.body.email,
          "Welcome to our App!",
          "Please verify your Email account."
        );
      })
      .catch((error) => {
        //log the error for debugging
        // console.log("PWD insert")
        // console.log(error)

        /***********************************************************************
         * If we get an error inserting the PWD, we should go back and remove
         * the user from the member table. We don't want a member in that table
         * without a PWD! That implementation is up to you if you want to add
         * that step.
         **********************************************************************/

        response.status(400).send({
          message: "other error, see detail",
          detail: error.detail,
        });
      });
  }
);

router.get("/hash_demo", (request, response) => {
  let password = "hello12345";

  let salt = generateSalt(32);
  let salted_hash = generateHash(password, salt);
  let unsalted_hash = generateHash(password);

  response.status(200).send({
    salt: salt,
    salted_hash: salted_hash,
    unsalted_hash: unsalted_hash,
  });
});

module.exports = router;
