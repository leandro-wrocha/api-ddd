import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'

interface CommentOnQuestionUseCaseRequest {
  author_id: string
  question_id: string
  content: string
}

interface CreateQuesionUseCaseResponse {
  question_comment: QuestionComment
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private question_comments_repository: QuestionCommentRepository,
  ) {}

  async execute({
    author_id,
    question_id,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CreateQuesionUseCaseResponse> {
    const question = await this.questionsRepository.findById(question_id)

    if (!question) {
      throw new Error('Question not found')
    }

    const question_comment = QuestionComment.create({
      author_id: new UniqueEntityID(author_id),
      question_id: new UniqueEntityID(question_id),
      content,
    })

    await this.question_comments_repository.create(question_comment)

    return {
      question_comment,
    }
  }
}
