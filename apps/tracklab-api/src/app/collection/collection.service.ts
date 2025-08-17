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
  async createCollectionItem(data: Prisma.CollectionItemCreateInput) {
    return this.prisma.collectionItem.create({ data });
  }

  /**
   * Retrieves a collection item from the database
   * @param uuid the uuid of the item to retrieve
   */
  async getCollectionItem(uuid: string) {
    return await this.prisma.collectionItem.findUnique({ where: { uuid } });
  }

  /**
   * Updates a collection item from the database
   * @param where the where clause of the item to update
   * @param data the data clause of the item to update
   */
  async updateCollectionItem(
    where: Prisma.CollectionItemWhereUniqueInput,
    data: Prisma.CollectionItemUpdateInput,
  ) {
    return this.prisma.collectionItem.update({ where, data });
  }

  /**
   * Deletes a collection item from the database
   * @param uuid the uuid of the item to delete
   */
  async deleteCollectionItem(uuid: string) {
    return await this.prisma.collectionItem.delete({ where: { uuid } });
  }
}
