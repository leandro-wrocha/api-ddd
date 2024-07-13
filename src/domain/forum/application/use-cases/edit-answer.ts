import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditAnswerUseCaseRequest {
  author_id: string
  question_id: string
  content: string
  attachmentIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    author_id,
    question_id,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(question_id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (author_id !== answer.author_id.to_string()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(question_id)
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList

    answer.content = content

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
