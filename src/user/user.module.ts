import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas';
import { MODEL } from '@Model';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MODEL.USER_MODEL,
        schema: UserSchema,
      },
    ]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
