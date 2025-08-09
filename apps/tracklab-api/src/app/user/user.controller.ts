import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@tracklab/models';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
}
