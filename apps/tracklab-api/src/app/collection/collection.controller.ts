import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UpdateFavoriteRequest } from '@tracklab/models';

@UseGuards(JwtAuthGuard)
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
      const identifier = `thumbnails/${uuid}.png`;

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

  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: multer.memoryStorage(),
    }),
  )
  @Post()
  async createCollectionItem(
    @Req() request: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    thumbnail: Express.Multer.File,
  ) {
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const decodedUser = this.jwtService.decode(bearer);

    const body = request.body;
    const collectionItem = await this.collectionService.createCollectionItem({
      title: body.title,
      description: body.description,
      url: body.url,
      user: {
        connect: {
          uuid: decodedUser.sub,
        },
      },
    });

    if (thumbnail) {
      await this.storageService.saveFile(
        thumbnail,
        'thumbnails',
        collectionItem.uuid,
      );
    }
  }

  @Patch('favorite')
  async setFavorite(@Body() body: UpdateFavoriteRequest) {
    return await this.collectionService.updateCollectionItem(
      { uuid: body.uuid },
      { isFavorite: body.isFavorite },
    );
  }

  @Delete(':uuid')
  async deleteCollectionItem(@Param('uuid') uuid: string) {
    const identifier = `thumbnails/${uuid}.png`;

    const retVal = await this.collectionService.deleteCollectionItem(uuid);
    await this.storageService.deleteFile(identifier);
    return retVal;
  }
}
