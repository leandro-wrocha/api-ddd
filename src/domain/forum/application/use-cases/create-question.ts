import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'

interface CreateQuestionUseCaseRequest {
  author_id: string
  title: string
  content: string
}

interface CreateQuesionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    author_id,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuesionUseCaseResponse> {
    const question = Question.create({
      author_id: new UniqueEntityID(author_id),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return {
      question,
    }
  }
}
