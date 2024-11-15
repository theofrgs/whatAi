import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import databaseConfig from './config/typeorm.config';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './services/seed/seed.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './services/guards/auth.guard';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { QueryOptMiddleware } from './services/middlewares/query-opt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('API_JWT_SECRET'),
        signOptions: { expiresIn: '6000h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MessageModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [
    SeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryOptMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
