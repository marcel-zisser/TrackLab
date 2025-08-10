import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Searches for a user based on the email
   * @param email the email of the user
   */
  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email: email },
      omit: { password: false },
    });
  }

  /**
   * Searches for a user based on the uuid
   * @param uuid the uuid of the user
   */
  async findOneByUuid(uuid: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { uuid: uuid },
    });
  }

  /**
   * Creates a new user
   * @param data the user creation context
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Updates specific user to new value
   * @param where identify unique user
   * @param data the new user data
   */
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return await this.prisma.user.update({ data, where });
  }
}
