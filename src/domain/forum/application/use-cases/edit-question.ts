import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditQuestionUseCaseRequest {
  author_id: string
  question_id: string
  title: string
  content: string
}

type EditQuesionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    author_id,
    question_id,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuesionUseCaseResponse> {
    const question = await this.questionsRepository.findById(question_id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (author_id !== question.author_id.to_string()) {
      return left(new NotAllowedError())
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
