import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able delete a question on comment', async () => {
    const new_question_comment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(new_question_comment)

    await sut.execute({
      author_id: new_question_comment.author_id.to_string(),
      question_comment_id: new_question_comment.id.to_string(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const new_question_comment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(new_question_comment)

    expect(async () => {
      return await sut.execute({
        author_id: 'author-2',
        question_comment_id: new_question_comment.id.to_string(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
