var mysql = require("mysql");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "database",
  multipleStatements: true,
});
