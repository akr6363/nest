import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getCities() {
    return this.prisma.city.findMany();
  }

  async getCitiesId() {
    return this.prisma.city.findMany({
      select: {
        id: true,
      },
    });
  }

  async getCityById(id: number) {
    return this.prisma.city.findUnique({ where: { id } });
  }
}
