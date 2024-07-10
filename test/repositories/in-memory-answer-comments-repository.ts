import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  async create(answer_comment: AnswerComment) {
    this.items.push(answer_comment)
  }

  async findById(id: string) {
    const answer_comment = this.items.find((item) => item.id.to_string() === id)

    if (!answer_comment) {
      return null
    }

    return answer_comment
  }

  async findByManyAnswerId({ page }: PaginationParams, answer_id: string) {
    const answer_comments = this.items
      .filter((item) => item.answer_id.to_string() === answer_id)
      .slice((page - 1) * 20, page * 20)

    return answer_comments
  }

  async delete(answer_comment: AnswerComment) {
    const answer_comment_index = this.items.findIndex(
      (item) => item.id === answer_comment.id,
    )

    this.items.splice(answer_comment_index, 1)
  }
}
