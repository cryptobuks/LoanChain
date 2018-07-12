var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "p2p"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
  var sql = "CREATE TABLE if not exists lender_login   ( ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,fname VARCHAR(16) , mname VARCHAR(16), lname VARCHAR(16), gender VARCHAR(32), aadhar VARCHAR(32) UNIQUE, pancard VARCHAR(16) UNIQUE, dob DATE, pincode int, city VARCHAR(16), email VARCHAR(32) UNIQUE , password VARCHAR(32), contact VARCHAR(32), uname VARCHAR(32), prikey VARCHAR(255), balance int Default 0, lending_score int  default 5, verified TINYINT default 0)";
  con.query(sql, function (err, result) {
    if (err) throw err;
   console.log("Table created");
  });


  var sql = "CREATE TABLE  if not exists borrower_login   (ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,fname VARCHAR(16) , mname VARCHAR(16), lname VARCHAR(16), gender VARCHAR(32), aadhar VARCHAR(32) UNIQUE, pancard VARCHAR(16) UNIQUE, email VARCHAR(32) UNIQUE , password VARCHAR(32), contact VARCHAR(32), uname VARCHAR(32), prikey VARCHAR(255), amount INT(10), tenure INT(4), interest INT(4), purpose VARCHAR(50), description VARCHAR(255), married VARCHAR(8) , dob DATE, pincode INT(10) , city VARCHAR(20), job VARCHAR(32) , exp VARCHAR(16), prof VARCHAR(32), turnover INT(10), profit INT(10), residence VARCHAR(32), sp_inc INT(10), other_inc INT(10), loan VARCHAR(4), credcard VARCHAR(4), verified TINYINT default 0)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });


var sql = "CREATE TABLE  if not exists lendings ( borrowerID INT NOT NULL PRIMARY KEY, borrower_n VARCHAR(20), net_borrowed INT(10), amount_left INT(10), maturity INT(4), interest INT(4), emi INT(10))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

var sql = "CREATE TABLE if not exists  lendinfo  ( borrowerID INT NOT NULL , lenderID INT NOT NULL  , borrower_n VARCHAR(20), lender_n VARCHAR(20), principal INT(10), months_left INT(4), penalty INT(10))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

var sql = "CREATE TABLE IF NOT EXISTS `sessions` ( `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL, `expires` int(11) unsigned NOT NULL, `data` text COLLATE utf8mb4_bin, PRIMARY KEY (`session_id`)) ENGINE=InnoDB";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });





