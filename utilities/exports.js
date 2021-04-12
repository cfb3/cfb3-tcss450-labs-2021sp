//Get the connection to Heroku Database
let pool = require('./sql_conn.js')

//Get the crypto utility functions
let credUtils = require('./credentialingUtils')
let generateHash = credUtils.generateHash
let generateSalt = credUtils.generateSalt

let validation = require('./validationUtils.js')

module.exports = { 
    pool, generateHash, generateSalt, validation
}
