
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Searches for a user based on the email
   * @param email the email to search for
   */
  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email: email },
      omit: { password: false },
    });
  }

  /**
   * Creates a new user
   * @param data the user creation context
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data,  });
  }
}
