/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
class Comment {
  constructor(payload) {

    this._verifyPayload(payload);

    const {
      id, username, date, content, is_delete,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object'
      || typeof content !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
