/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'ini content', thread = 'thread-123', owner = 'user-123', date = new Date()
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, thread, owner, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, thread, owner, date],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE is_delete = false AND id = $1 ',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteCommentsById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
