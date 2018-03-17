const mysql = require('mysql');
const config = {
    host     : '103.74.117.99',
    user     : 'trangbds_tool',
    database : 'trangbds_home',
    password: 'kl4w08knvW'
}
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    test_conn() {
        this.connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('MYSQL is connected');            
        })
        this.close();
        
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( err => {
                if ( err )
                return reject( err );
                resolve();
            } );
        } );
    }
}
let conn = new Database(config);

module.exports = conn;