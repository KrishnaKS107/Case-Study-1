import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

interface CreateUserInput {
  name: string;
  email: string;
  address?: string;
  password: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserInput) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        address: input.address,
        passwordHash,
        role: input.role ?? Role.USER,
      },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async changePassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }
}


