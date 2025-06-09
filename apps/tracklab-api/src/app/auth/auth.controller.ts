import { Controller, Post, UseGuards, Res, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponse } from '@tracklab/models';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { User } from '@prisma/client';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse
  ): Promise<LoginResponse> {
    return this.authService.login(request.user as User, response);
  }


  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: ExpressRequest) {
    return req.logOut(() => console.log('Logged out'));
  }

}
