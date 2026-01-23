import { UserCredentialsEntity } from './entities/user_credentials.entity';

export const AUTH_RESPOSITORY = Symbol('AUTH_REPOSITORY');

export interface AuthRepository {
  findCredentialByEmail(email: string): Promise<UserCredentialsEntity | null>;
  createCredential(data: {
    email: string;
    passwordHash: string;
  }): Promise<UserCredentialsEntity>;
}
