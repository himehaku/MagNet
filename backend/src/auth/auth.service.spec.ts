import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;

  let usersService: {
    findByEmail: jest.Mock;
  };

  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should return access token and user data when credentials are valid', async () => {
    const user = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hashed-password',
    };

    usersService.findByEmail.mockResolvedValue(user);

    mockedBcrypt.compare.mockResolvedValue(
      true as never,
    );

    jwtService.signAsync.mockResolvedValue(
      'jwt-token',
    );

    const result = await service.login({
      email: 'ana@test.com',
      password: 'secret123',
    });

    expect(
      usersService.findByEmail,
    ).toHaveBeenCalledWith(
      'ana@test.com',
    );

    expect(
      mockedBcrypt.compare,
    ).toHaveBeenCalledWith(
      'secret123',
      'hashed-password',
    );

    expect(
      jwtService.signAsync,
    ).toHaveBeenCalledWith({
      sub: 1,
      email: 'ana@test.com',
    });

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: 1,
        name: 'Ana',
        email: 'ana@test.com',
      },
    });

    expect(result.user).not.toHaveProperty(
      'passwordHash',
    );
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(
      null,
    );

    await expect(
      service.login({
        email: 'missing@test.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(
      mockedBcrypt.compare,
    ).not.toHaveBeenCalled();

    expect(
      jwtService.signAsync,
    ).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hashed-password',
    });

    mockedBcrypt.compare.mockResolvedValue(
      false as never,
    );

    await expect(
      service.login({
        email: 'ana@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(
      jwtService.signAsync,
    ).not.toHaveBeenCalled();
  });
});