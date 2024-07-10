import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentRepository {
  create(answer_comment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findByManyAnswerId(
    params: PaginationParams,
    question_id: string,
  ): Promise<AnswerComment[]>
  delete(answer_comment: AnswerComment): Promise<void>
}
