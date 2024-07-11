import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a question', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-1'))

    const newAnswer = makeAnswer({
      question_id: question.id,
      author_id: new UniqueEntityID('author-1'),
    })

    inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      question_id: newAnswer.id.to_value(),
      author_id: 'author-1',
      content: 'conteudo teste',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0].content).toEqual('conteudo teste')
  })

  it('should not be able to edit a question from another user', async () => {
    makeQuestion({}, new UniqueEntityID('question-1'))

    const newAnswer = makeAnswer(
      {
        author_id: new UniqueEntityID('author-1'),
        content: 'example teste',
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      question_id: newAnswer.id.to_value(),
      author_id: 'author-2',
      content: 'conteudo teste',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
