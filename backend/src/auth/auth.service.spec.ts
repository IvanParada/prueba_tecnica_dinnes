import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;

  let configService: {
    getOrThrow: jest.Mock;
  };

  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(async () => {
    configService = {
      getOrThrow: jest.fn((key: string) => {
        const environmentVariables = {
          AUTH_EMAIL: 'admin@dinnes.cl',
          AUTH_PASSWORD: 'secure-password',
        };

        const value =
          environmentVariables[key as keyof typeof environmentVariables];

        if (!value) {
          throw new Error(`Missing environment variable: ${key}`);
        }

        return value;
      }),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'ADMIN@DINNES.CL',
        password: 'secure-password',
      };

      jwtService.signAsync.mockResolvedValue('generated-access-token');

      const result = await service.login(loginDto);

      expect(configService.getOrThrow).toHaveBeenCalledWith('AUTH_EMAIL');

      expect(configService.getOrThrow).toHaveBeenCalledWith('AUTH_PASSWORD');

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: 'admin@dinnes.cl',
      });

      expect(result).toEqual({
        accessToken: 'generated-access-token',
        user: {
          email: 'admin@dinnes.cl',
        },
      });
    });

    it('should throw UnauthorizedException for an invalid email', async () => {
      const loginDto: LoginDto = {
        email: 'incorrecto@dinnes.cl',
        password: 'secure-password',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciales inválidas'),
      );

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for an invalid password', async () => {
      const loginDto: LoginDto = {
        email: 'admin@dinnes.cl',
        password: 'incorrect-password',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciales inválidas'),
      );

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
