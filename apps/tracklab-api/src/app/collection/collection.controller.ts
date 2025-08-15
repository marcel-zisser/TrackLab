import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import {
  CollectionService,
  UserWithCollectionItems,
} from './collection.service';
import { ReadStream } from 'fs';
import { StorageService } from '../storage/storage.service';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Controller('collection')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getAllCollectionItems(@Req() request: Request) {
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const decodedUser = this.jwtService.decode(bearer);
    const user = (await this.userService.user({
      where: {
        uuid: decodedUser.sub,
      },
      include: {
        CollectionItems: true,
      },
    })) as UserWithCollectionItems;

    return user.CollectionItems;
  }

  @Get('thumbnail/:uuid')
  async getCollectionItemThumbnail(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    try {
      const identifier = `collectionItem/${uuid}.png}`;
      const head = await this.storageService.getHead(identifier);

      res.setHeader(
        'Content-Type',
        head.ContentType || 'application/octet-stream',
      );
      res.setHeader('Content-Length', head.ContentLength?.toString() || '');

      const avatar = await this.storageService.getFile(identifier);

      (avatar.Body as unknown as ReadStream).pipe(res);
    } catch (e) {
      console.log(e);
    }
  }

  @Get(':uuid')
  getCollectionItem(@Param('uuid') uuid: string) {
    return this.collectionService.getCollectionItem(uuid);
  }

  @Post()
  createCollectionItem(@Req() request: Request) {
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const decodedUser = this.jwtService.decode(bearer);

    const body = request.body;
    this.collectionService.createCollectionItem({
      title: body.title,
      description: body.description,
      url: body.url,
      user: decodedUser.sub,
    });
  }
}
