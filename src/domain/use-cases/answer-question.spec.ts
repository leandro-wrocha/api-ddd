import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer';

const fakeAnswersRespository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  },
}

describe('AnswerQuestionUseCase', () => {
  it('should be able create a answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRespository)

    const answer = await answerQuestion.execute({
      question_id: '1',
      instructor_id: '1',
      content: 'Nova resposta'
    })

    expect(answer.content).toEqual('Nova resposta')
  })
})