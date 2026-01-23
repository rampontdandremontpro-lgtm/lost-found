import { IsIn, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsIn(['LOST', 'FOUND'])
  status: 'LOST' | 'FOUND';

  @IsUUID()
  ownerProfileId: string;

  @IsUUID()
  categoryId: string;
}
