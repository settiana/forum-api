/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class CreatedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, owner,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedThread;
