import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answer_id: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answer_id() {
    return this.props.answer_id
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
