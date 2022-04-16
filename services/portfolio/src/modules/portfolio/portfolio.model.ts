import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Portfolio {
  @Field()
  public token: string;

  @Field()
  public amount: number;
}
