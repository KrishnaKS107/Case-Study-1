import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertUserRating(userId: string, storeId: string, value: number) {
    return this.prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      create: { userId, storeId, value },
      update: { value },
    });
  }

  getMyRating(userId: string, storeId: string) {
    return this.prisma.rating.findUnique({ where: { userId_storeId: { userId, storeId } } });
  }
}


