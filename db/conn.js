var mysql = require('mysql');

var con = mysql.createConnection({
    host: "103.74.117.99",
    port:"3306",
    user: "chobds_home",
    password: "gglG3zQb",
    database: "chobds_home"
});

module.exports = con;