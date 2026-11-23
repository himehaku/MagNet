import { BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { Job } from '../jobs/entities/job.entity';

import { CompatibilityService } from './compatibility.service';

describe('CompatibilityService', () => {
  let service: CompatibilityService;

  let httpService: {
    post: jest.Mock;
  };

  let configService: {
    get: jest.Mock;
  };

  let usersService: {
    findById: jest.Mock;
  };

  let jobsRepository: {
    findOne: jest.Mock;
  };  

  beforeEach(async () => {
    httpService = {
      post: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    };

    usersService = {
      findById: jest.fn(),
    };

    jobsRepository = {
      findOne: jest.fn(),
    };    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompatibilityService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },

        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: getRepositoryToken(Job),
          useValue: jobsRepository,
        },        
      ],
    }).compile();

    service = module.get<CompatibilityService>(
      CompatibilityService,
    );
  });

  it('should call Python compatibility service using configured URL', async () => {
    configService.get.mockReturnValue(
      'http://python-service:8000',
    );

    const requestData = {
      user_skills: ['Python', 'Docker'],
      job_skills: ['Python', 'PostgreSQL'],
    };

    const pythonResponse = {
      compatibility: 50,
      matched: ['python'],
      missing: ['postgresql'],
    };

    httpService.post.mockReturnValue(
      of({
        data: pythonResponse,
      }),
    );

    const result = await service.calculate(
      requestData,
    );

    expect(httpService.post).toHaveBeenCalledWith(
      'http://python-service:8000/compatibility',
      requestData,
    );

    expect(result).toEqual(
      pythonResponse,
    );
  });

  it('should use default Python service URL when config is missing', async () => {
    configService.get.mockReturnValue(undefined);

    const requestData = {
      user_skills: ['Angular'],
      job_skills: ['Angular'],
    };

    httpService.post.mockReturnValue(
      of({
        data: {
          compatibility: 100,
          matched: ['angular'],
          missing: [],
        },
      }),
    );

    await service.calculate(requestData);

    expect(httpService.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/compatibility',
      requestData,
    );
  });

  it('should throw BadGatewayException when Python service fails', async () => {
    configService.get.mockReturnValue(
      'http://python-service:8000',
    );

    httpService.post.mockReturnValue(
      throwError(() => new Error('connection failed')),
    );

    await expect(
      service.calculate({
        user_skills: ['Python'],
        job_skills: ['Python'],
      }),
    ).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});