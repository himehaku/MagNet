import { BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Repository } from 'typeorm';

import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JobsService', () => {
  let service: JobsService;
  let repository: jest.Mocked<Repository<Job>>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<Job>>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: repository,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);

    configService.get.mockReturnValue(
      'http://127.0.0.1:8000',
    );

    mockedAxios.get.mockReset();
  });

  it('should create a new job from Python service', async () => {
    const pythonJob = {
      external_id: 'job-123',
      title: 'Backend Developer',
      company: 'Empresa Test',
      description: 'Python y FastAPI',
      location: 'Chile',
      remote: true,
      category: 'Programming',
      source: 'Get on Board',
      source_url: 'https://www.getonbrd.com/jobs/job-123',
      published_at: '2026-11-10T12:00:00.000Z',
      fetched_at: '2026-11-20T12:00:00.000Z',
    };

    mockedAxios.get.mockResolvedValue({
      data: {
        source: 'Get on Board',
        count: 1,
        jobs: [pythonJob],
      },
    });

    repository.findOne.mockResolvedValue(null);

    const createdJob = {
      id: 1,
      externalId: pythonJob.external_id,
      title: pythonJob.title,
      company: pythonJob.company,
      description: pythonJob.description,
      location: pythonJob.location,
      remote: pythonJob.remote,
      category: pythonJob.category,
      source: pythonJob.source,
      sourceUrl: pythonJob.source_url,
      publishedAt: new Date(pythonJob.published_at),
      fetchedAt: new Date(pythonJob.fetched_at),
    } as Job;

    repository.create.mockReturnValue(createdJob);
    repository.save.mockResolvedValue(createdJob);

    const result = await service.importFromPython(20);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/jobs/fetch',
      {
        params: {
          limit: 20,
        },
        timeout: 10000,
      },
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        source: 'Get on Board',
        externalId: 'job-123',
      },
    });

    expect(repository.create).toHaveBeenCalled();

    expect(repository.save).toHaveBeenCalledWith(
      createdJob,
    );

    expect(result).toEqual({
      source: 'Get on Board',
      received: 1,
      created: 1,
      updated: 0,
    });
  });

  it('should update an existing job', async () => {
    const pythonJob = {
      external_id: 'job-123',
      title: 'Backend Developer Updated',
      company: 'Empresa Test',
      description: 'Descripción actualizada',
      location: 'Chile',
      remote: true,
      category: 'Programming',
      source: 'Get on Board',
      source_url: 'https://www.getonbrd.com/jobs/job-123',
      published_at: '2026-11-10T12:00:00.000Z',
      fetched_at: '2026-11-20T12:00:00.000Z',
    };

    mockedAxios.get.mockResolvedValue({
      data: {
        source: 'Get on Board',
        count: 1,
        jobs: [pythonJob],
      },
    });

    const existingJob = {
      id: 1,
      externalId: 'job-123',
      title: 'Backend Developer',
      company: 'Empresa Test',
      description: 'Descripción anterior',
      location: 'Chile',
      remote: true,
      category: 'Programming',
      source: 'Get on Board',
      sourceUrl: 'https://www.getonbrd.com/jobs/job-123',
      publishedAt: new Date(
        '2026-11-10T12:00:00.000Z',
      ),
      fetchedAt: new Date(
        '2026-11-19T12:00:00.000Z',
      ),
    } as Job;

    repository.findOne.mockResolvedValue(existingJob);
    repository.save.mockResolvedValue(existingJob);

    const result = await service.importFromPython(20);

    expect(repository.create).not.toHaveBeenCalled();

    expect(existingJob.title).toBe(
      'Backend Developer Updated',
    );

    expect(existingJob.description).toBe(
      'Descripción actualizada',
    );

    expect(repository.save).toHaveBeenCalledWith(
      existingJob,
    );

    expect(result).toEqual({
      source: 'Get on Board',
      received: 1,
      created: 0,
      updated: 1,
    });
  });

  it('should throw BadGatewayException when Python service fails', async () => {
    mockedAxios.get.mockRejectedValue(
      new Error('connection failed'),
    );

    await expect(
      service.importFromPython(20),
    ).rejects.toBeInstanceOf(
      BadGatewayException,
    );

    expect(repository.save).not.toHaveBeenCalled();
  });
});