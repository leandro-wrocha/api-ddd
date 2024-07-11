import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  question_id: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    question_comments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  constructor(private question_comment_repository: QuestionCommentRepository) {}

  async execute({
    page,
    question_id,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const question_comments =
      await this.question_comment_repository.findByManyQuestionId(
        { page },
        question_id,
      )

    return right({
      question_comments,
    })
  }
}
