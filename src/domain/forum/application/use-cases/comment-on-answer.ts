import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from './errors/not-allowed-error'

interface CommentOnAnswerUseCaseRequest {
  author_id: string
  answer_id: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  NotAllowedError,
  {
    answer_comment: AnswerComment
  }
>

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
      return left(new NotAllowedError())
    }

    const answer_comment = AnswerComment.create({
      author_id: new UniqueEntityID(author_id),
      answer_id: new UniqueEntityID(answer_id),
      content,
    })

    await this.answers_comments_repository.create(answer_comment)

    return right({
      answer_comment,
    })
  }
}
