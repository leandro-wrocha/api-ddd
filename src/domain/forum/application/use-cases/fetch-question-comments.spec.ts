import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        question_id: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        question_id: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        question_id: new UniqueEntityID('question-1'),
      }),
    )

    const { question_comments } = await sut.execute({
      page: 1,
      question_id: 'question-1',
    })

    expect(question_comments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({ question_id: new UniqueEntityID('question-1') }),
      )
    }

    const { question_comments } = await sut.execute({
      page: 2,
      question_id: 'question-1',
    })

    expect(question_comments).toHaveLength(2)
  })
})
