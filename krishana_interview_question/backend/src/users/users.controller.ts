import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() body: { newPassword: string }) {
    await this.usersService.changePassword(req.user.sub, body.newPassword);
    return { ok: true };
    
  }
}


