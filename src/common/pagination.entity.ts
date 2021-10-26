import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Pagination {
  @Field(() => Int)
  count: number
}
