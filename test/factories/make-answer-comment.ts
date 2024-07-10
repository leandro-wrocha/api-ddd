import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerCommit(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const answer_comment = AnswerComment.create(
    {
      author_id: new UniqueEntityID(),
      answer_id: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answer_comment
}
