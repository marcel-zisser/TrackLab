import { Controller, Post, UseGuards, Res, Request, HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponse, RefreshTokenResponse } from '@tracklab/models';
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

  @Post('logout')
  @HttpCode(204)
  logout(@Res() res: ExpressResponse): ExpressResponse {
    // Clear refresh token from cookies
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  @Post('refresh')
  refresh(@Req() request: ExpressRequest): Promise<RefreshTokenResponse> {
    return this.authService.refresh(request);
  }

}
