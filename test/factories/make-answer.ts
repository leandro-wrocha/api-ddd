import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      author_id: new UniqueEntityID(),
      content: faker.lorem.text(),
      question_id: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answer
}
