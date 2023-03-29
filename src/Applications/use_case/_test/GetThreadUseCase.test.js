const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const thread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const currentDate = new Date();
    const comments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: currentDate,
        content: 'sebuah comment',
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: currentDate,
        content: '**komentar telah dihapus**',
      },
    ];

    const expectedThreadData = {
      ...thread,
      comments,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: threadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: currentDate,
          content: 'sebuah comment',
          is_delete: false,
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: currentDate,
          content: 'sebuah comment2 apapun itu akan  terhapus',
          is_delete: true,
        },
      ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadData = await getThreadUseCase.execute(threadId);
    // Assert
    expect(threadData).toStrictEqual(expectedThreadData);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
