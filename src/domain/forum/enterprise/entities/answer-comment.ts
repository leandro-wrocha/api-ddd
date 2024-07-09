import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'

export interface AnswerCommentProps {
  author_id: UniqueEntityID
  answer_id: UniqueEntityID
  content: string
  created_at: Date
  updated_at?: Date
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get content() {
    return this.props.content
  }

  get author_id() {
    return this.props.author_id
  }

  get created_at() {
    return this.props.created_at
  }

  get updated_at() {
    return this.props.updated_at
  }

  private touch() {
    this.props.updated_at = new Date()
  }

  set content(content: string) {
    this.props.content = content
  }

  static create(
    props: Optional<AnswerCommentProps, 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
