import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  author_id: UniqueEntityID
  question_id: UniqueEntityID
  attachments: AnswerAttachmentList
  created_at: Date
  updated_at?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  get author_id() {
    return this.props.author_id
  }

  get question_id() {
    return this.props.question_id
  }

  private touch() {
    this.props.updated_at = new Date()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set content(content: string) {
    this.props.content = content
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
  }

  static create(
    props: Optional<AnswerProps, 'created_at' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
