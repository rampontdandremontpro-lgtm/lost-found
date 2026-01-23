import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class ItemsQueryDto {
  @IsOptional()
  @IsString()
  category?: string; 

  @IsOptional()
  @IsIn(['LOST', 'FOUND'])
  status?: 'LOST' | 'FOUND';

  @IsOptional()
  @IsUUID()
  ownerProfileId?: string;
}
