const CreatedComment = require('../CreatedComment');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'First comment',
      thread: 'thread-123',
      owner: '',
      is_delete: false,
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'First comment',
      thread: 'thread-123',
      owner: 123,
      is_delete: false,
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'First comment',
      thread: 'thread-123',
      owner: 'user-123xx',
      is_delete: false,
    };

    // Action
    const createdComment = new CreatedComment(payload);

    // Assert
    expect(createdComment).toBeInstanceOf(CreatedComment);
    expect(createdComment.id).toEqual(payload.id);
    expect(createdComment.thread).toEqual(payload.thread);
    expect(createdComment.content).toEqual(payload.content);
    expect(createdComment.owner).toEqual(payload.owner);
    expect(createdComment.is_delete).toEqual(payload.is_delete);
  });

  it('should create CreatedComment with hide content deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'First comment',
      thread: 'thread-123',
      owner: 'user-123xx',
      is_delete: true,
    };

    // Action
    const createdComment = new CreatedComment(payload);

    // Assert
    expect(createdComment).toBeInstanceOf(CreatedComment);
    expect(createdComment.id).toEqual(payload.id);
    expect(createdComment.thread).toEqual(payload.thread);
    expect(createdComment.content).toEqual('**komentar telah dihapus**');
    expect(createdComment.owner).toEqual(payload.owner);
    expect(createdComment.is_delete).toEqual(payload.is_delete);
  });

});
