// const nano = require('nano');
//
// const couch = nano(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');
//
// const databases = ['users', 'messages'];
//
// async function initCouch() {
//   return createDatabases()
//     .catch(error => {
//       console.log('Got an error initializing databases');
//       throw new Error(error);
//     });
// }
// async function createDatabases() {
//   for (const database of databases) await createDatabase(database);
// }
// async function createDatabase(db) {
//   return couch.db.create(db)
//     .catch(err => {
//       // failure - error information is in 'err'
//       if (err && err.statusCode !== 412) throw new Error(err);
//     })
// }


const Cloudant = require('@cloudant/cloudant');

const vcap = require('../../vcap_local.json');

function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({
            url: vcap.services.cloudantNoSQLDB.credentials.url
        }, ((err, cloudant) => {
            if (err) {
                console.error('Connect failure: ' + err.message + ' for Cloudant DB: ' +
                    appSettings.cloudant_db_name);
                reject(err);
            } else {
                let db = cloudant.use(appSettings.cloudant_db_name);
                console.log('Connect success! Connected to DB: ' + appSettings.cloudant_db_name);
                resolve(db);
            }
        }));
    });
}


let db;

// Initialize the DB when this module is loaded
(function getDbConnection() {
    console.log('Initializing Cloudant connection...', 'items-dao-cloudant.getDbConnection()');
    utils.dbCloudantConnect().then((database) => {
        console.log('Cloudant connection initialized.', 'items-dao-cloudant.getDbConnection()');
        db = database;
    }).catch((err) => {
        console.error('Error while initializing DB: ' + err.message, 'items-dao-cloudant.getDbConnection()');
        throw err;
    });
})();

module.exports = {db};
