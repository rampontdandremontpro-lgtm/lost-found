import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from './contexts/auth/auth.module'
import { ProfileModule } from './contexts/profile/profile.module';
import { ItemsModule } from './contexts/items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CategoryModule } from './contexts/ressource/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
            type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? '3306'),
        username: config.get<string>('DB_USERNAME') ?? 'root',
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_DATABASE') ?? 'backend_base',
    synchronize: config.get<boolean>('DB_SYNCHRONIZE') ?? true,
    logging: config.get<boolean>('DB_LOGGING') ?? true,

    autoLoadEntities: true,

    charset: 'utf8mb4',
    timezone: 'Z',

    migrations: [
      join(process.cwd(), 'dist/core/database/migrations/*.js'),
      join(process.cwd(), 'src/core/database/migrations/*.ts'),
    ],
  })
}),
  CategoryModule, AuthModule, ProfileModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
