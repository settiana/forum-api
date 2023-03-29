const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add Thread function', () => {
    it('should persist creeated thread and return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action

      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should throw error when can  verify thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw error when can not pass verify thread ', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123x')).rejects.toThrowError(NotFoundError);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      }));
    });

    it('should return thread by thread id', async () => {
      // arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, '123');
      const createdAt = new Date();

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date: createdAt });

      // action
      const thread = await threadRepository.getThreadById('thread-123');
      // expect(thread).toHaveLength(1);

      // assert
      expect(thread).toHaveProperty('id');
      expect(thread.id).toEqual('thread-123');

      expect(thread).toHaveProperty('title');
      expect(thread.title).toEqual('ini title');

      expect(thread).toHaveProperty('body');
      expect(thread.body).toEqual('ini body');

      expect(thread).toHaveProperty('username');
      expect(thread.username).toEqual('dicoding');

      expect(thread).toHaveProperty('date');
      expect(thread.date).toEqual(createdAt);
    });

    it('should return not found for not existed thread id', async () => {
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123x')).rejects.toThrowError(NotFoundError);
    });
  });
});
