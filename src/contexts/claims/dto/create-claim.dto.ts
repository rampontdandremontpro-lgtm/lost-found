import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  message: string;
}