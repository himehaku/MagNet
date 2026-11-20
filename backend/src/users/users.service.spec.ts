import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

jest.mock('bcrypt');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    const users = [
      {
        id: 1,
        name: 'Ana',
        email: 'ana@test.com',
        passwordHash: 'hash',
      },
      {
        id: 2,
        name: 'Luis',
        email: 'luis@test.com',
        passwordHash: 'hash',
      },
    ] as User[];

    repository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should find a user by email', async () => {
    const user = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hash',
    } as User;

    repository.findOne.mockResolvedValue(user);

    const result = await service.findByEmail(
      'ana@test.com',
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'ana@test.com',
      },
    });

    expect(result).toEqual(user);
  });

  it('should create a new user and hide passwordHash', async () => {
    repository.findOne.mockResolvedValue(null);

    mockedBcrypt.hash.mockResolvedValue(
      'hashed-password' as never,
    );

    const createdUser = {
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hashed-password',
    } as User;

    repository.create.mockReturnValue(createdUser);
    repository.save.mockResolvedValue(createdUser);

    const result = await service.create({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'secret123',
    });

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'ana@test.com',
      },
    });

    expect(mockedBcrypt.hash).toHaveBeenCalledWith(
      'secret123',
      10,
    );

    expect(repository.create).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hashed-password',
    });

    expect(repository.save).toHaveBeenCalledWith(
      createdUser,
    );

    expect(result).toEqual({
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
    });

    expect(result).not.toHaveProperty(
      'passwordHash',
    );
  });

  it('should throw ConflictException when email already exists', async () => {
    repository.findOne.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hash',
    } as User);

    await expect(
      service.create({
        name: 'Ana',
        email: 'ana@test.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});