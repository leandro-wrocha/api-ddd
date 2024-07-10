import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  answer_id: string
}

interface FetchAnswerCommentsUseCaseResponse {
  answer_comments: AnswerComment[]
}

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

    return {
      answer_comments,
    }
  }
}
