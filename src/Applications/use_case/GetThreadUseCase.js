/* eslint-disable no-underscore-dangle */
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const dispComment = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      ...thread,
      comments: dispComment,
    };
  }
}

module.exports = GetThreadUseCase;
