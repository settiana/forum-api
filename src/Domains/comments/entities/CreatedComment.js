/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
class CreatedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, thread, owner, is_delete,
    } = payload;

    this.id = id;
    this.thread = thread;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.owner = owner;
    this.is_delete = is_delete;
  }

  _verifyPayload({
    id, thread, content, owner, is_delete,
  }) {
    if (!id || !thread || !content || !owner
       || (is_delete == undefined || is_delete == null)) {
      throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof thread !== 'string'
      || typeof content !== 'string' || typeof owner !== 'string'
      || typeof is_delete !== 'boolean'
    ) {
      throw new Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedComment;
