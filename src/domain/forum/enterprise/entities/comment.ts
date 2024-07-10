import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  author_id: UniqueEntityID
  content: string
  created_at: Date
  updated_at?: Date
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get author_id() {
    return this.props.author_id
  }

  get content() {
    return this.props.content
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
}
