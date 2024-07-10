import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerCommit } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommit({
        answer_id: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommit({
        answer_id: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommit({
        answer_id: new UniqueEntityID('answer-1'),
      }),
    )

    const { answer_comments } = await sut.execute({
      page: 1,
      answer_id: 'answer-1',
    })

    expect(answer_comments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerCommit({ answer_id: new UniqueEntityID('answer-1') }),
      )
    }

    const { answer_comments } = await sut.execute({
      page: 2,
      answer_id: 'answer-1',
    })

    expect(answer_comments).toHaveLength(2)
  })
})
