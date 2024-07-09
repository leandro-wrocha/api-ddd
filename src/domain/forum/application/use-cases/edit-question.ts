import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseRequest {
  author_id: string
  question_id: string
  title: string
  content: string
}

interface EditQuesionUseCaseResponse {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    author_id,
    question_id,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuesionUseCaseResponse> {
    const question = await this.questionsRepository.findById(question_id)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (author_id !== question.author_id.to_string()) {
      throw new Error('Not allowed.')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
