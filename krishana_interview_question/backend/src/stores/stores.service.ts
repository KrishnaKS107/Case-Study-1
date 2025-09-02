import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  createStore(input: { name: string; email?: string; address?: string; ownerId: string }) {
    return this.prisma.store.create({ data: input });
  }

  async listStores(params: { search?: string; skip?: number; take?: number }) {
    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search } },
            { address: { contains: params.search } },
          ],
        }
      : undefined;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        skip: params.skip,
        take: params.take,
        include: { ratings: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.store.count({ where }),
    ]);
    return {
      total,
      items: items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        averageRating: s.ratings.length
          ? s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length
          : 0,
      })),
    };
  }

  getOwnerStore(ownerId: string) {
    return this.prisma.store.findUnique({ where: { ownerId }, include: { ratings: { include: { user: true } } } });
  }
}


