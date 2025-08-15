import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';

export type UserWithCollectionItems = Prisma.UserGetPayload<{
  include: { CollectionItems: true };
}>;

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Saves a new collection item to the database
   */
  createCollectionItem(data: Prisma.CollectionItemCreateInput) {
    this.prisma.collectionItem.create({ data });
  }

  /**
   * Retrieves a collection item from the database
   * @param uuid the uuid of the item to retrieve
   */
  async getCollectionItem(uuid: string) {
    return await this.prisma.collectionItem.findUnique({ where: { uuid } });
  }
}
