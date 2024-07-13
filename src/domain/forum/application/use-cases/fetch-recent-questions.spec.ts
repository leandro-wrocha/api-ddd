import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Rencet Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ created_at: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ created_at: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ created_at: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ created_at: new Date(2022, 0, 23) }),
      expect.objectContaining({ created_at: new Date(2022, 0, 20) }),
      expect.objectContaining({ created_at: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent question', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ created_at: new Date(2022, 0, 20) }),
      )
    }

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(2)
  })
})
