import { QuestionCommentRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  author_id: string
  question_comment_id: string
}

interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(
    private question_comments_repository: QuestionCommentRepository,
  ) {}

  async execute({
    author_id,
    question_comment_id,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const question_comment =
      await this.question_comments_repository.findById(question_comment_id)

    if (author_id !== question_comment?.author_id.to_string()) {
      throw new Error('Not allowed')
    }

    if (!question_comment) {
      throw new Error('Question comment not found')
    }

    await this.question_comments_repository.delete(question_comment)

    return {}
  }
}
