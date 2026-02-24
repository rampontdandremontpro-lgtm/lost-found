import { IsString, IsUUID } from 'class-validator';

export class LogoutDto {
  @IsUUID()
  credentialsId: string;
}