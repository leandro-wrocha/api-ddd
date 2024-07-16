import { left } from '@/core/either'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.question_id.to_string(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    await this.sendNotification.execute({
      recipientId: question.author_id.to_string(),
      title: `new answer on "${question.title.substring(0, 40).concat('...')}"`,
      content: answer.excerpt,
    })
  }
}
