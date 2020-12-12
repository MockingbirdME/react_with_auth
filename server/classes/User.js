const util = require('util');
const deepEqual = require('deep-equal')

const database = require('./couchdb').couch.use('users');

class User {

  static async loadOrCreateUser(otkaInfo) {
    return database.get(otkaInfo.sub)
      .catch(error => {
        if (error.statusCode === 404) {
          console.log(`New user, ${otkaInfo.name}, loging in.`);
          return {_id: otkaInfo.sub, name: otkaInfo.name};
        }
        console.log('got error fetching doc');
        console.log(error);
      })
      .then(async document => {
        let {_id, _rev, name} = document;
        const user = new User({_id, _rev, name, otkaInfo});
        if (!_rev || !deepEqual(otkaInfo, document.otkaInfo)) await user.save();
        return user;
      });

  }

  constructor({_id, _rev, name, otkaInfo}) {
    if (!_id || !name || !otkaInfo) throw new Error('Note requries an id, name, and otkaInfo fields.');

    this._id = _id;

    if (_rev) this._rev = _rev;

    this.name = name;

    this._otkaInfo = otkaInfo;
  }

  get id() {return this._id;}

  get rev() {return this._rev || undefined;}

  get name() {return this._name;}

  set name(name) {
    if (!name || typeof name !== 'string') throw new Error('Name must exist and be a string.');

    this._name = name;
  }

  get otkaInfo() {return this._otkaInfo;}

  async save() {
    const doc = {
      _id: this.id,
      _rev: this.rev,
      name: this.name,
      otkaInfo: this.otkaInfo
    };

    const saveResult = await database.insert(doc);

    if (!saveResult.ok) throw new Error('Unable to save user.');
  }

  /**
   * Convert the user object into a JSON object for storage.
   * @return {object}
   */
  toJSON() {
    const {id, name, otkaInfo} = this;
    return {id, name, otkaInfo};
  }

  /**
   * Override the default util.inspect behavior.
   */
  [util.inspect.custom]() {
    return this.toJSON();
  }

}

module.exports = User;
