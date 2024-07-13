import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

// multipart/form-data
// create question -> json -> ids dos anexos

interface CreateQuestionUseCaseRequest {
  author_id: string
  title: string
  content: string
  attachemntsIds: string[]
}

type CreateQuesionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    author_id,
    title,
    content,
    attachemntsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuesionUseCaseResponse> {
    const question = Question.create({
      author_id: new UniqueEntityID(author_id),
      title,
      content,
    })

    const questionAttachments = attachemntsIds.map((attachemntId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachemntId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
