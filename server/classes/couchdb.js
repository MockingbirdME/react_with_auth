const nano = require('nano');

const couch = nano(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

const databases = ['users', 'messages'];

async function initCouch() {
  return createDatabases()
    .catch(error => {
      console.log('Got an error initializing databases');
      throw new Error(error);
    });
}
async function createDatabases() {
  for (const database of databases) await createDatabase(database);
}
async function createDatabase(db) {
  return couch.db.create(db)
    .catch(err => {
      // failure - error information is in 'err'
      if (err && err.statusCode !== 412) throw new Error(err);
    })
}


module.exports = {initCouch, couch};
