import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { CategoryModule } from './contexts/ressource/category/category.module';
import { EventModule } from './core/events/event_modules';
import { AuthModule } from './contexts/auth/auth.module';
import { ProfileModule } from './contexts/profile/profile.module';
import { ItemsModule } from './contexts/items/items.module';
import { PermissionModule } from './core/permissions/permission.module';
import { ClaimsModule } from './contexts/claims/claims.module';
import { MailerModule } from './core/mailers/mailer.module';
import { CoreJwtModule } from './core/jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? '8889'),
        username: config.get<string>('DB_USERNAME') ?? 'root',
        password: config.get<string>('DB_PASSWORD') ?? 'root',
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
      }),
    }),
    CoreJwtModule,
    CategoryModule,
    AuthModule,
    ProfileModule,
    ItemsModule,
    EventModule,
    PermissionModule, 
    ClaimsModule,
    MailerModule,
  ],
})
export class AppModule {}