import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Choose Answer Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able create a comment on question', async () => {
    const new_question = makeAnswer()

    await inMemoryAnswersRepository.create(new_question)

    await sut.execute({
      author_id: new_question.author_id.to_string(),
      answer_id: new_question.id.to_string(),
      content: 'teste',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('teste')
  })
})
