import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { CityService } from '../city/city.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CityService],
})
export class UserModule {}
