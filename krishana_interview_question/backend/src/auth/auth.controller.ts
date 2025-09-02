import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../../generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('signup')
  async signup(
    @Body()
    body: { name: string; email: string; address?: string; password: string; role?: Role },
  ) {
    const user = await this.users.createUser(body);
    return { user };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }
}


