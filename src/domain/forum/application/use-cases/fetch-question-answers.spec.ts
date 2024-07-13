import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        question_id: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        question_id: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        question_id: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      question_id: 'question-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ question_id: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      question_id: 'question-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
