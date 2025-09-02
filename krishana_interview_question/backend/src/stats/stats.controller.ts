import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('users')
  users() {
    return this.prisma.user.count();
  }

  @Get('stores')
  stores() {
    return this.prisma.store.count();
  }

  @Get('ratings')
  ratings() {
    return this.prisma.rating.count();
  }
}


