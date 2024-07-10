import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async create(question_comment: QuestionComment) {
    this.items.push(question_comment)
  }

  async findById(id: string) {
    const question_comment = this.items.find(
      (item) => item.id.to_string() === id,
    )

    if (!question_comment) {
      return null
    }

    return question_comment
  }

  async findByManyQuestionId({ page }: PaginationParams, question_id: string) {
    const question_comments = this.items
      .filter((item) => item.question_id.to_string() === question_id)
      .slice((page - 1) * 20, page * 20)

    return question_comments
  }

  async delete(question_comment: QuestionComment) {
    const question_comment_index = this.items.findIndex(
      (item) => item.id === question_comment.id,
    )

    this.items.splice(question_comment_index, 1)
  }
}
