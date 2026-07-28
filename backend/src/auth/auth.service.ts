import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const email = this.configService.getOrThrow<string>('AUTH_EMAIL');
    const password = this.configService.getOrThrow<string>('AUTH_PASSWORD');

    if (
      loginDto.email.toLowerCase() !== email.toLowerCase() ||
      loginDto.password !== password
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.jwtService.signAsync({
      email,
    });

    return {
      accessToken,
      user: {
        email,
      },
    };
  }
}
