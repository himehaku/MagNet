import { Test, TestingModule } from '@nestjs/testing';

import { CompatibilityController } from './compatibility.controller';
import { CompatibilityService } from './compatibility.service';

describe('CompatibilityController', () => {
  let controller: CompatibilityController;

  let compatibilityService: {
    calculate: jest.Mock;
  };

  beforeEach(async () => {
    compatibilityService = {
      calculate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompatibilityController],
      providers: [
        {
          provide: CompatibilityService,
          useValue: compatibilityService,
        },
      ],
    }).compile();

    controller = module.get<CompatibilityController>(
      CompatibilityController,
    );
  });

  it('should delegate compatibility calculation to CompatibilityService', async () => {
    const requestData = {
      user_skills: ['Python', 'Docker'],
      job_skills: ['Python', 'PostgreSQL'],
    };

    const expectedResult = {
      compatibility: 50,
      matched: ['python'],
      missing: ['postgresql'],
    };

    compatibilityService.calculate.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.calculate(
      requestData,
    );

    expect(
      compatibilityService.calculate,
    ).toHaveBeenCalledWith(requestData);

    expect(result).toEqual(
      expectedResult,
    );
  });
});