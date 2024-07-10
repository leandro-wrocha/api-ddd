import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optinonal'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  question_id: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get question_id() {
    return this.props.question_id
  }

  static create(
    props: Optional<QuestionCommentProps, 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new QuestionComment(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
