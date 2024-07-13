import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionAttachmentsRepository,
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      question_id: newQuestion.id.to_value(),
      author_id: 'author-1',
      title: 'pergunta teste',
      content: 'conteudo teste',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0].title).toEqual('pergunta teste')
    expect(inMemoryQuestionsRepository.items[0].content).toEqual(
      'conteudo teste',
    )

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      question_id: newQuestion.id.to_value(),
      author_id: 'author-2',
      title: 'pergunta teste',
      content: 'conteudo teste',
      attachmentIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
