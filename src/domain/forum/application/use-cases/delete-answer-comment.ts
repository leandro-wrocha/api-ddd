import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  author_id: string
  answer_comment_id: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(private answer_comments_repository: AnswerCommentRepository) {}

  async execute({
    author_id,
    answer_comment_id,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answer_comment =
      await this.answer_comments_repository.findById(answer_comment_id)

    if (!answer_comment) {
      return left(new ResourceNotFoundError())
    }

    if (author_id !== answer_comment?.author_id.to_string()) {
      return left(new NotAllowedError())
    }

    await this.answer_comments_repository.delete(answer_comment)

    return right({})
  }
}
