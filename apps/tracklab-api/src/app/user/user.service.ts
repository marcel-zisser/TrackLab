import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Searches for a user based on criterion
   * @param params params for retrieving a unique user
   */
  async user(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): Promise<User> {
    const { where, include, omit } = params;

    return this.prisma.user.findUnique({
      where,
      include,
      omit,
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
