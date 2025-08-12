import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from '@tracklab/models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
    private storageService: StorageService,
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

  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.memoryStorage(),
    }),
  )
  @Put(':uuid')
  async updateUser(
    @Param('uuid') uuid: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 10000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar: Express.Multer.File,
    @Body() body: User,
  ): Promise<User> {
    let avatarUrl: string | null = null;

    if (avatar) {
      avatarUrl = await this.storageService.saveFile(avatar, 'avatar', uuid);
    }

    const user = await this.userService.updateUser(
      { uuid: uuid },
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        avatarUrl: avatarUrl,
      },
    );

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
