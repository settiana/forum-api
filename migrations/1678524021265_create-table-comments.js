/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      thread: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      is_delete: {
        type: 'BOOLEAN',
        notNull: true,
        default: false,
      },
      date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
      }
    });
  
    pgm.addConstraint('comments', 'fk_comments.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('comments');
  };
  