import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/users.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<CreateUserDto[]> {
    return this.prisma.users.findMany();
  }

  async getUsersByCity() {
    return this.prisma.users.findMany({
      where: {
        city: {
          count: {
            lt: 534666,
          },
        },
      },
      select: { id: true, name: true },
      skip: 2,
      take: 2,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createUser(data: CreateUserDto) {
    try {
      const res = await this.prisma.users.create({
        data: { ...data },
      });
      console.log(res);
      return res;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
