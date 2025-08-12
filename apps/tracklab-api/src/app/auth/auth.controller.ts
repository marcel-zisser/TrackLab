import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponse, RefreshTokenResponse } from '@tracklab/models';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Request() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<void> {
    const createdUser = await this.authService.register({
      email: request.body.email,
      password: request.body.password,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      avatarUrl: null,
    });

    if (createdUser) {
      response.sendStatus(HttpStatus.CREATED);
    } else {
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<LoginResponse> {
    return this.authService.login(request.user as User, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res() res: ExpressResponse): ExpressResponse {
    // Clear refresh token from cookies
    res.clearCookie('refreshToken');
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('refresh')
  refresh(@Req() request: ExpressRequest): Promise<RefreshTokenResponse> {
    return this.authService.refresh(request);
  }
}
