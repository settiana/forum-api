const CreateComment = require('../CreateComment');

describe('a Create Comment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      content: '',
    };

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      thread: 'thread 123',
      owner: 'owner 123',
    };

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'seru nih topiknya gan!',
      thread: 'thread 123',
      owner: 'owner 123',
    };

    // Action
    const createComment = new CreateComment(payload);

    // Assert
    expect(createComment).toBeInstanceOf(CreateComment);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.thread).toEqual(payload.thread);
    expect(createComment.owner).toEqual(payload.owner);
  });
});
