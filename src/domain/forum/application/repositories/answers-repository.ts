import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findByManyQuestionId(
    params: PaginationParams,
    question_id: string,
  ): Promise<Answer[]>
}