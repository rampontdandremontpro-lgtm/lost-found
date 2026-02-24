import { IsIn, IsString, IsUUID, MinLength } from 'class-validator';

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
  categoryId: string;
}