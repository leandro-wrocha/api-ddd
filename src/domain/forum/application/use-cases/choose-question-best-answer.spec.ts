import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able choose best answer', async () => {
    const new_question = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(new_question)

    const new_answer = makeAnswer(
      {
        question_id: new_question.id,
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(new_answer)

    const { question } = await sut.execute({
      author_id: 'author-1',
      answer_id: 'answer-1',
    })

    expect(question.best_answer_id?.to_string()).toEqual('answer-1')
  })

  it('should not be able choose best answer', async () => {
    const new_question = makeQuestion(
      {
        author_id: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(new_question)

    const new_answer = makeAnswer(
      {
        question_id: new_question.id,
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(new_answer)

    expect(() => {
      return sut.execute({
        author_id: 'author-2',
        answer_id: 'answer-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
