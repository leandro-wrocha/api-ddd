import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'

interface CommentOnAnswerUseCaseRequest {
  author_id: string
  answer_id: string
  content: string
}

interface CommentOnAnswerUseCaseResponse {
  answer_comment: AnswerComment
}

export class CommentOnAnswerUseCase {
  constructor(
    private answers_repository: AnswersRepository,
    private answers_comments_repository: AnswerCommentRepository,
  ) {}

  async execute({
    author_id,
    answer_id,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answers_repository.findById(answer_id)

    if (!answer) {
      throw new Error('Answer not found')
    }

    const answer_comment = AnswerComment.create({
      author_id: new UniqueEntityID(author_id),
      answer_id: new UniqueEntityID(answer_id),
      content,
    })

    await this.answers_comments_repository.create(answer_comment)

    return {
      answer_comment,
    }
  }
}
