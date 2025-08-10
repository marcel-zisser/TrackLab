import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from '@tracklab/models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string): Promise<User> {
    const user = await this.userService.findOneByUuid(uuid);
    return {
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    } satisfies User;
  }

  @Put(':uuid')
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() body: User,
  ): Promise<User> {
    const user = await this.userService.updateUser({ uuid: uuid }, body);
    return {
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    } satisfies User;
  }

  @Patch(':uuid')
  async updatePassword(@Param('uuid') uuid: string, @Req() req: Request) {
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = await this.userService.findOneByUuid(uuid);
    const decodedUser = this.jwtService.decode(bearer);

    if (
      !user ||
      decodedUser.sub !== user.uuid ||
      req.body['newPassword'] !== req.body['newPasswordRepeat']
    ) {
      throw new BadRequestException();
    }

    const userValid = await this.authService.validateUser(
      user.email,
      req.body['currentPassword'],
    );

    if (userValid) {
      const newHash = await bcrypt.hash(req.body['newPassword'], 10);
      await this.userService.updateUser({ uuid: uuid }, { password: newHash });
    } else {
      throw new UnauthorizedException();
    }
  }
}
