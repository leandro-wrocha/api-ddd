import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  answer_id: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answer_comments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answer_comment_repository: AnswerCommentRepository) {}

  async execute({
    page,
    answer_id,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answer_comments =
      await this.answer_comment_repository.findByManyAnswerId(
        { page },
        answer_id,
      )

    return right({
      answer_comments,
    })
  }
}
