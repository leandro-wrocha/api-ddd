import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'

export interface AnswerProps {
  content: string
  author_id: UniqueEntityID
  question_id: UniqueEntityID
  created_at: Date
  updated_at?: Date
}

export class Answer extends Entity<AnswerProps> {
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

  static create(
    props: Optional<AnswerProps, 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return answer
  }
}
