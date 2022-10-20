import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { StoryModule } from './story/story.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.${process.env.NODE_ENV?.trim()}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => ({
        uri: configService.get('DATABASE_URI'),
        retryAttempts: 3,
        retryDelay: 1,
      }),
    }),
    UserModule,
    MailModule,
    CategoryModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
