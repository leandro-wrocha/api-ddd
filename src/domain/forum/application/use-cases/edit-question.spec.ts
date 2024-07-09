import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      question_id: newQuestion.id.to_value(),
      author_id: 'author-1',
      title: 'pergunta teste',
      content: 'conteudo teste',
    })

    expect(inMemoryQuestionsRepository.items[0].title).toEqual('pergunta teste')
    expect(inMemoryQuestionsRepository.items[0].content).toEqual(
      'conteudo teste',
    )
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        question_id: newQuestion.id.to_value(),
        author_id: 'author-2',
        title: 'pergunta teste',
        content: 'conteudo teste',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
