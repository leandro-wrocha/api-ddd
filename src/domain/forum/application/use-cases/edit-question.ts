import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  author_id: string
  question_id: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuesionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    author_id,
    question_id,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuesionUseCaseResponse> {
    const question = await this.questionsRepository.findById(question_id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (author_id !== question.author_id.to_string()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(question_id)
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
