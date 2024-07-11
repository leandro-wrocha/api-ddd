import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  author_id: string
  question_id: string
}

type DeleteQuesionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    author_id,
    question_id,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuesionUseCaseResponse> {
    const question = await this.questionsRepository.findById(question_id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (author_id !== question.author_id.to_string()) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right({})
  }
}
