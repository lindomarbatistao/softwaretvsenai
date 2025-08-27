const mysql = require('mysql')

const db = mysql.createConnection({
  // host: "localhost",
  host: "sistematv",
  user: "tv",
  password: "MySQL@2023",
  database: "tv_senai"
});

module.exports = db;