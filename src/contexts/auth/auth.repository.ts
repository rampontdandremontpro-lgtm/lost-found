import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialsEntity } from './entities/user_credentials.entity';
import { AuthRepository } from './auth.repository.interface';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectRepository(UserCredentialsEntity)
    private readonly credentialRepository: Repository<UserCredentialsEntity>,
  ) {}

  findCredentialByEmail(email: string): Promise<UserCredentialsEntity | null> {
    return this.credentialRepository.findOne({ where: { email } });
  }

  async createCredential(data: { email: string; passwordHash: string }) {
    const entity = this.credentialRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
    });
    return this.credentialRepository.save(entity);
  }
}
