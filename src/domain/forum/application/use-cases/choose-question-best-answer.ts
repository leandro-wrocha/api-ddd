import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answer_id: string
  author_id: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answer_id,
    author_id,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answer_id)

    if (!answer) {
      return left(new NotAllowedError())
    }

    const question = await this.questionsRepository.findById(
      answer.question_id.to_string(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.author_id.to_string() !== author_id) {
      return left(new NotAllowedError())
    }

    question.best_answer_id = answer.id

    return right({
      question,
    })
  }
}
