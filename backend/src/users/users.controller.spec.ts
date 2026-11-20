import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  let usersService: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(
      UsersController,
    );
  });

  it('should delegate user creation to UsersService', async () => {
    const createUserDto = {
      name: 'Ana',
      email: 'ana@test.com',
      password: 'secret123',
    };

    const expectedResult = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
    };

    usersService.create.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.create(
      createUserDto,
    );

    expect(
      usersService.create,
    ).toHaveBeenCalledWith(
      createUserDto,
    );

    expect(result).toEqual(
      expectedResult,
    );
  });
});