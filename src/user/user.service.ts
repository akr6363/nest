import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.users.findMany();
  }

  async createUser(data: any) {
    return this.prisma.users.create({
      data: { ...data },
    });
  }
}
