import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@tracklab/models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Put(':uuid')
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() body: User,
  ): Promise<User> {
    const user = await this.userService.updateUser({ uuid: uuid }, body);
    return {
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    } satisfies User;
  }
}
