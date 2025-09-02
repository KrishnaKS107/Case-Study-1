import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratings: RatingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  rate(@Req() req: any, @Body() body: { storeId: string; value: number }) {
    return this.ratings.upsertUserRating(req.user.sub, body.storeId, body.value);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  my(@Req() req: any, @Query('storeId') storeId: string) {
    return this.ratings.getMyRating(req.user.sub, storeId);
  }
}


