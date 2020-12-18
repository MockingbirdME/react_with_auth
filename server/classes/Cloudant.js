// require('dotenv').load();

// Load the Cloudant library.
var CLOUDANT = require('@cloudant/cloudant');

// Initialize Cloudant with settings from .env
const {CLOUDANT_URL, CLOUDANT_IAM_API_KEY} = process.env;

var cloudant = CLOUDANT({ url: CLOUDANT_URL, maxAttempt: 5, plugins: [ { iamauth: { iamApiKey: CLOUDANT_IAM_API_KEY } }, { retry: { retryDelayMultiplier: 4 } } ]});
// Using the async/await style.

class Cloudant {
  constructor({name}) {
    if (!name) throw new Error("Database requires a name to construct.");

    this._name = `react_with_auth-${name}`;

    this._database = cloudant.db.use(this._name);
  }

  async create() {
    const exists = await this.exists();
    console.log(`${this._name} does ${exists ? "" : "not"} exist.`);
    console.log(exists);
    if (!exists) await cloudant.db.create(this._name)
      .then(response => {
        console.log('got response creating database');
        console.log(response);
      })
      .catch(error => {
        console.log(`error creating database ${this._name}`);
        console.log(error);
        throw error;
      });
    else console.log(`Database with name ${this._name} already exists`);
  }

  async get(documentId) {
    return this._database.get(documentId);
  }

  async insert(document) {
    return this._database.insert(document);
  }

  async exists() {
    return this._database.info()
      .then(info => {return true;})
      .catch(error => {
        if (error.statusCode === 404) return false;
        console.error('error checking database info');
        throw error;
      });
  }

}


module.exports = Cloudant;
