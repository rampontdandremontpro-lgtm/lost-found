import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @IsOptional()
  @IsIn(['LOST', 'FOUND'])
  status?: 'LOST' | 'FOUND';
}
