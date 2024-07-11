import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerCommit } from 'test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able delete a answer on comment', async () => {
    const new_answer_comment = makeAnswerCommit()

    await inMemoryAnswerCommentsRepository.create(new_answer_comment)

    await sut.execute({
      author_id: new_answer_comment.author_id.to_string(),
      answer_comment_id: new_answer_comment.id.to_string(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const new_answer_comment = makeAnswerCommit()

    await inMemoryAnswerCommentsRepository.create(new_answer_comment)

    const result = await sut.execute({
      author_id: new_answer_comment.id.to_string(),
      answer_comment_id: new_answer_comment.id.to_string(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
