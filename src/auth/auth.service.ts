import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Token } from './tokenTypes';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signupLocal(dto: AuthDto, response: Response): Promise<Token> {
    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword,
      },
    });

    const token = await this.genTokens(newUser.id, newUser.email, newUser.role);

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    response.cookie('access_token', token, cookieOptions);

    return {
      access_token: token,
    };
  }

  async signinLocal(dto: AuthDto, response: Response): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Wrong credentials!');

    const isPasswordVerified = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!isPasswordVerified) throw new ForbiddenException('Wrong credentials!');

    const token = await this.genTokens(user.id, user.email, user.role);
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    response.cookie('access_token', token, cookieOptions);

    return {
      access_token: token,
    };
  }

  async logout(response: Response): Promise<any> {
    const cookieOptions = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    response.cookie('access_token', undefined, cookieOptions);

    return {
      access_token: undefined,
    };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async genTokens(userId: string, email: string, role: string) {
    const at = await this.jwtService.signAsync(
      {
        userId,
        email,
        role,
      },
      { secret: process.env.JWT_SECRET, expiresIn: 60 * 60 * 24 * 7 },
    );
    return at;
  }
}
