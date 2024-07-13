import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'
import dayjs from 'dayjs'
import { QuestionAttachment } from './question-attachment'
import { QuestionAttachmentList } from './question-attachment-list'

export interface QuestionProps {
  author_id: UniqueEntityID
  best_answer_id?: UniqueEntityID
  attachments: QuestionAttachmentList
  title: string
  content: string
  slug: Slug
  created_at: Date
  updated_at?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get isNew(): boolean {
    return dayjs().diff(this.props.created_at, 'days') >= 3
  }

  private touch() {
    this.props.updated_at = new Date()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
  }

  get title() {
    return this.props.title
  }

  get best_answer_id() {
    return this.props.best_answer_id
  }

  get slug() {
    return this.props.slug
  }

  get author_id() {
    return this.props.author_id
  }

  get created_at() {
    return this.props.created_at
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set best_answer_id(best_answer_id: UniqueEntityID | undefined) {
    this.props.best_answer_id = best_answer_id
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'created_at' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return question
  }
}
