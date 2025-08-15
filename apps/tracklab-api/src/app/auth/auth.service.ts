import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  JwtTokenInformation,
  LoginResponse,
  RefreshTokenResponse,
} from '@tracklab/models';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | undefined> {
    const user = await this.userService.user({
      where: {
        email,
      },
      omit: {
        password: false,
      },
    });

    if (!user) {
      return undefined;
    }

    const passwordCorrect = await bcrypt.compare(pass, user.password);
    if (!passwordCorrect) {
      return undefined;
    }

    return {
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      avatarType: null,
    };
  }

  /**
   * Registers a user
   * @param user the user
   * @returns {Promise<LoginResponse>} Returns JWT token on success
   */
  async register(user: Prisma.UserCreateInput): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    return await this.userService.create(user);
  }

  /**
   * Logs a user in and returns an access token
   * in case of success
   * @param user the user
   * @param response the response object to set the refreshToken
   * @returns {Promise<LoginResponse>} Returns JWT token on success
   */
  async login(user: User, response: Response): Promise<LoginResponse> {
    const refreshToken = await this.generateRefreshToken(user);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
    });

    return {
      accessToken: await this.generateAccessToken(user),
    };
  }

  /**
   * Checks the provided refresh token and generates a new access token if valid
   * @param request The request containing the refresh token
   * @returns {Promise<RefreshTokenResponse>} Returns JWT token on success
   */
  async refresh(request: Request): Promise<RefreshTokenResponse> {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const valid = this.validateRefreshToken(refreshToken);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const decodedToken = this.jwtService.decode(refreshToken);
    const user = {
      uuid: decodedToken.sub,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      email: '',
      password: '',
      avatarType: null,
    } satisfies User;

    return {
      accessToken: await this.generateAccessToken(user),
    };
  }

  /**
   * Method to generate a short-lived access-token
   * @param user the user for whom the token is generated
   * @returns {string} The generated access-token
   */
  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
    } satisfies JwtTokenInformation;
    return this.jwtService.signAsync(payload);
  }

  /**
   * Method to generate a long-lived refresh-token
   * @param user the user for whom the token is generated   * @returns {string} The generated refresh-token
   */
  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
    } satisfies JwtTokenInformation;

    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  /**
   * Validates the given refresh token
   * @param token the refresh token to validate
   * @returns {any} a value if successful, null otherwise
   */
  private async validateRefreshToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch {
      return null;
    }
  }
}
