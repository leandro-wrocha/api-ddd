import { Either, left, right } from '@/core/either'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteQuestionCommentUseCaseRequest {
  author_id: string
  question_comment_id: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

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
      return left(new NotAllowedError())
    }

    if (!question_comment) {
      return left(new ResourceNotFoundError())
    }

    await this.question_comments_repository.delete(question_comment)

    return right({})
  }
}
