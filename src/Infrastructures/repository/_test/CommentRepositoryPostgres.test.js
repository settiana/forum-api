const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add Comment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const createdComment = await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: createdComment.content,
        thread: 'thread-123',
        owner: 'user-123',
        is_delete: false,
      }));
    });
  });

  describe('Verify, Delete, and Get Comments function', () => {
    it('should throw AuthorizationError when verify not owned comment', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      
      // Action
      await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123x')).rejects.toThrowError(AuthorizationError);
    });

    it('should verify comment found correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123x', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should verify comment authorized correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });
      
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123x')).rejects.toThrowError(AuthorizationError);
    });

    it('should failed delete not exist comment', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123x', 'user-123x')).rejects.toThrowError(NotFoundError);

      // Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123x')).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'ini content',
        thread: 'thread-123',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await commentRepositoryPostgres.addComment({ ...createComment, thread: 'thread-123', owner: 'user-123' });
      await commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123');
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(0);
    });

    it('should return  comment by thread id', async () => {

      const createdAt = new Date();

      const commentRepository = new CommentRepositoryPostgres(pool, '123');

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123', date: createdAt });

      const comment = await commentRepository.getCommentsByThreadId('thread-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toEqual('comment-123');
      expect(comment[0].username).toEqual('dicoding');
      expect(comment[0].content).toEqual('ini content');
      expect(comment[0].date).toEqual(createdAt);
      expect(comment[0].is_delete).toEqual(false);
    });
  });
});
