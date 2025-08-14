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
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
import { ReadStream } from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
    private storageService: StorageService,
  ) {}

  @Get('avatar')
  async getAvatar(@Req() req: Request, @Res() res: Response) {
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const decodedUser = this.jwtService.decode(bearer);
    const user = await this.userService.findOneByUuid(decodedUser.sub);

    try {
      const head = await this.storageService.getHead(
        `avatar/${decodedUser.sub}.${user.avatarType}`,
      );

      res.setHeader(
        'Content-Type',
        head.ContentType || 'application/octet-stream',
      );
      res.setHeader('Content-Length', head.ContentLength?.toString() || '');

      const avatar = await this.storageService.getFile(
        `avatar/${decodedUser.sub}.${user.avatarType}`,
      );

      (avatar.Body as unknown as ReadStream).pipe(res);
    } catch (e) {
      console.log(e);
    }
  }

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
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    avatar: Express.Multer.File,
    @Body() body: User,
  ): Promise<User> {
    let avatarType = null;

    if (avatar) {
      await this.storageService.saveFile(avatar, 'avatar', uuid);
      avatarType = avatar.mimetype.split('/')[1];
    }

    const user = await this.userService.updateUser(
      { uuid: uuid },
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        avatarType: avatarType,
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
