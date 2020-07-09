const mysql = require("mysql");
require("dotenv").config();

// connection.
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWORD,
  dateStrings: "true",
});

async function createTables() {
  let message = "DB created";
  try {
    //connect
    await asyncQuery(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
      connection
    );
    connection.changeUser({ database: process.env.DB_NAME });
    // create table users
    await asyncQuery(
      "CREATE TABLE IF NOT EXISTS users ( user_id INT auto_increment primary key, uname varchar(25) not null unique, fname varchar(25) not null, lname varchar(25) not null, pword varchar(255) not null, isadmin boolean default false)",
      connection
    );
    // create table vacations
    await asyncQuery(
      "CREATE TABLE IF NOT EXISTS vacations (vacation_id int AUTO_INCREMENT Primary key, destination varchar(255) not null, description varchar(255) not null, price_usd int not null, pic varchar(20000) not null, sdate date not null, edate date not null, CONSTRAINT CHECK (char_length(destination)>1))", connection
    );
    // create table followers
    await asyncQuery(
      "create table IF NOT EXISTS followers(user_id int,vacation_id int, follow boolean default false, foreign key (user_id) references users(user_id) on update cascade on Delete cascade, foreign key (vacation_id) references vacations (vacation_id) on update cascade on Delete cascade)",
      connection
    );
  } catch (error) {
    console.log(error);
    message = error && error.error && error.error.sqlMessage.toString();
  } finally {
    connection.end();
    console.log(message);
  }
}

createTables();

/**
 * async DB request
 * @param {*} q - query
 * @param {*} connection
 * @returns same as main function
 */
function asyncQuery(q, connection) {
  return new Promise((resolve, reject) => {
    let failure = {};
    let success = {};
    connection.query(q, (error, _results) => {
      if (error) {
        failure.error = error;
        reject(failure);
      } else {
        success.results = _results;
        resolve(success);
      }
    });
  });
}
