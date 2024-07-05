import { Slug } from './value-objects/slug'
import { Entity } from '../../core/entities/entity'
import { UniqueEntityID } from '../../core/entities/unique-entity-id'
import { Optional } from '../../core/types/optinonal'
import dayjs from 'dayjs'

interface QuestionProps {
  author_id: UniqueEntityID
  best_answer_id?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  created_at: Date
  updated_at?: Date
}

export class Question extends Entity<QuestionProps> {
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
    this.props.content = this.content
    this.touch()
  }

  get title() {
    return this.props.title
  }

  get best_answer_id() {
    return this.props.best_answer_id
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
    props: Optional<QuestionProps, 'created_at' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        created_at: new Date(),
      },
      id,
    )

    return question
  }
}
