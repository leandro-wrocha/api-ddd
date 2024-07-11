import { Either, right } from '@/core/either'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
  instructor_id: string
  question_id: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructor_id,
    question_id,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      author_id: new UniqueEntityID(instructor_id),
      question_id: new UniqueEntityID(question_id),
    })

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
