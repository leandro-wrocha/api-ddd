import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerCommit } from 'test/factories/make-answer-comment'

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

    expect(async () => {
      return await sut.execute({
        author_id: 'author-2',
        answer_comment_id: new_answer_comment.id.to_string(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
