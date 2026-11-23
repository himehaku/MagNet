import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let authService: {
    login: jest.Mock;
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
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

  it('should return authenticated user profile', async () => {
    const request = {
      user: {
        userId: 1,
        email: 'ana@test.com',
      },
    };

    const expectedProfile = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      location: null,
      skills: [],
      interests: [],
      experienceYears: 0,
      preferredRemote: false,
    };

    authService.getProfile.mockResolvedValue(
      expectedProfile,
    );

    const result = await controller.getProfile(
      request,
    );

    expect(
      authService.getProfile,
    ).toHaveBeenCalledWith(1);

    expect(result).toEqual(
      expectedProfile,
    );
  });

  it('should update authenticated user profile', async () => {
    const request = {
      user: {
        userId: 1,
        email: 'ana@test.com',
      },
    };

    const updateProfileDto = {
      location: 'Viña del Mar',
      skills: ['Angular', 'NestJS'],
      interests: ['Web Development'],
      experienceYears: 2,
      preferredRemote: true,
    };

    const expectedResult = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      ...updateProfileDto,
    };

    authService.updateProfile.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.updateProfile(
      request,
      updateProfileDto,
    );

    expect(
      authService.updateProfile,
    ).toHaveBeenCalledWith(
      1,
      updateProfileDto,
    );

    expect(result).toEqual(
      expectedResult,
    );
  });
    
});