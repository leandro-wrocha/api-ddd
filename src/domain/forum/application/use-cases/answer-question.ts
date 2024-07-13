import { Either, right } from '@/core/either'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructor_id: string
  question_id: string
  content: string
  attachmentIds: string[]
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
    attachmentIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      author_id: new UniqueEntityID(instructor_id),
      question_id: new UniqueEntityID(question_id),
    })

    const answerAttachments = attachmentIds.map((attachemntId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachemntId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
