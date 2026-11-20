import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: {
    findAll: jest.Mock;
    importFromPython: jest.Mock;
  };

  beforeEach(async () => {
    jobsService = {
      findAll: jest.fn(),
      importFromPython: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: jobsService,
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should pass search filters to JobsService', () => {
    controller.findAll(
      'angular',
      'Chile',
      'true',
      'Programming',
    );

    expect(jobsService.findAll).toHaveBeenCalledWith({
      q: 'angular',
      location: 'Chile',
      remote: true,
      category: 'Programming',
    });
  });

  it('should convert remote=false to boolean false', () => {
    controller.findAll(
      undefined,
      undefined,
      'false',
      undefined,
    );

    expect(jobsService.findAll).toHaveBeenCalledWith({
      q: undefined,
      location: undefined,
      remote: false,
      category: undefined,
    });
  });

  it('should throw BadRequestException for invalid remote value', () => {
    expect(() =>
      controller.findAll(
        undefined,
        undefined,
        'yes',
        undefined,
      ),
    ).toThrow(BadRequestException);

    expect(jobsService.findAll).not.toHaveBeenCalled();
  });

  it('should import jobs using the provided limit', () => {
    controller.importJobs(5);

    expect(
      jobsService.importFromPython,
    ).toHaveBeenCalledWith(5);
  });

  it('should use 20 as default import limit', () => {
    controller.importJobs();

    expect(
      jobsService.importFromPython,
    ).toHaveBeenCalledWith(20);
  });
});