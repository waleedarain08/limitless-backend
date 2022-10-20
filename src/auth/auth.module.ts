import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '@Model';
import { UserSchema } from 'src/user/schemas';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MongooseModule.forFeature([
      {
        name: MODEL.USER_MODEL,
        schema: UserSchema,
      },
    ]),
    JwtModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET_KEY'),
    //     signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
    //   }),
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
