import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let authService: {
    login: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(
      AuthController,
    );
  });

  it('should delegate login to AuthService', async () => {
    const loginDto = {
      email: 'ana@test.com',
      password: 'secret123',
    };

    const expectedResult = {
      accessToken: 'jwt-token',
      user: {
        id: 1,
        name: 'Ana',
        email: 'ana@test.com',
      },
    };

    authService.login.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.login(
      loginDto,
    );

    expect(
      authService.login,
    ).toHaveBeenCalledWith(
      loginDto,
    );

    expect(result).toEqual(
      expectedResult,
    );
  });

  it('should return authenticated user profile', () => {
    const request = {
      user: {
        id: 1,
        name: 'Ana',
        email: 'ana@test.com',
      },
    };

    const result = controller.getProfile(
      request,
    );

    expect(result).toEqual(
      request.user,
    );
  });
});