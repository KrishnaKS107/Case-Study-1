import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: { name: string; email?: string; address?: string; ownerId: string }) {
    return this.stores.createStore(body);
  }

  // Public list/search for users
  @Get()
  list(@Query('q') q?: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    return this.stores.listStores({ search: q, skip: skip ? Number(skip) : undefined, take: take ? Number(take) : undefined });
  }

  // Owner dashboard info
  @UseGuards(AuthGuard('jwt'))
  @Get('owner/me')
  async ownerMyStore(@Req() req: any) {
    return this.stores.getOwnerStore(req.user.sub);
  }
}


