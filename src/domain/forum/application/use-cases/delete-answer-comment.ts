import { AnswerCommentRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  author_id: string
  answer_comment_id: string
}

interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answer_comments_repository: AnswerCommentRepository) {}

  async execute({
    author_id,
    answer_comment_id,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answer_comment =
      await this.answer_comments_repository.findById(answer_comment_id)

    if (author_id !== answer_comment?.author_id.to_string()) {
      throw new Error('Not allowed')
    }

    if (!answer_comment) {
      throw new Error('Answer comment not found')
    }

    await this.answer_comments_repository.delete(answer_comment)

    return {}
  }
}
