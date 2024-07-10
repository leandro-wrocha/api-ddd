import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  question_id: string
}

interface FetchQuestionCommentsUseCaseResponse {
  question_comments: QuestionComment[]
}

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

    return {
      question_comments,
    }
  }
}
