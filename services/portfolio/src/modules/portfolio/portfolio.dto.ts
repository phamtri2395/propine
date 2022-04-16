import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import { IsYYYYMMDD } from '@common/validators';

@ArgsType()
export class FindAllByDateArgs {
  @Field()
  @IsYYYYMMDD()
  public date: string;
}

@ArgsType()
export class FindByTokenAndByDateArgs {
  @Field()
  @IsString()
  public token: string;

  @Field()
  @IsYYYYMMDD()
  public date: string;
}
