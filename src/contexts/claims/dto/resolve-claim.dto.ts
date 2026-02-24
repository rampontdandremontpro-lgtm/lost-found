import { IsOptional, IsString, MinLength } from 'class-validator';

export class ResolveClaimDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  message?: string;
}