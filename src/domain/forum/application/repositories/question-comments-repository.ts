import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  create(question_comment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findByManyQuestionId(
    params: PaginationParams,
    question_id: string,
  ): Promise<QuestionComment[]>
  delete(question_comment: QuestionComment): Promise<void>
}
