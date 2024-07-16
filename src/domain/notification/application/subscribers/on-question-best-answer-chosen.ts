import { left } from '@/core/either'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.to_string(),
    )

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    await this.sendNotification.execute({
      recipientId: answer.author_id.to_string(),
      title: `sua resposta foi escholida`,
      content: `a sua resposta foi "${question.title.substring(0, 20).concat('...')}"`,
    })
  }
}
