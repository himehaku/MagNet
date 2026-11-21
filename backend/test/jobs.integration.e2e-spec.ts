import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DeepPartial,
  Repository,
} from 'typeorm';

import { Job } from '../src/jobs/entities/job.entity';
import { JobsService } from '../src/jobs/jobs.service';

describe('NestJS ↔ FastAPI integration', () => {
  let jobsService: JobsService;
  let repository: jest.Mocked<Repository<Job>>;

  beforeAll(async () => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Job>>;

    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'PYTHON_SERVICE_URL') {
          return 'http://127.0.0.1:8000';
        }

        return undefined;
      }),
    };

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
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

    jobsService =
      moduleFixture.get<JobsService>(JobsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    repository.findOne.mockResolvedValue(null);

    repository.create.mockImplementation(
    (data: DeepPartial<Job>) => data as Job,
    );

    repository.save.mockImplementation(
    async (
        job: DeepPartial<Job>,
    ) => job as Job,
    );
  });

  it('should fetch real jobs from FastAPI and process its contract', async () => {
    const result =
      await jobsService.importFromPython(1);

    expect(result.source).toBeTruthy();

    expect(result.received).toBeGreaterThan(0);

    expect(result.created).toBeGreaterThan(0);

    expect(
      repository.findOne,
    ).toHaveBeenCalled();

    expect(
      repository.create,
    ).toHaveBeenCalled();

    expect(
      repository.save,
    ).toHaveBeenCalled();
  });
});