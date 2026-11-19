import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
  ) {}

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('location') location?: string,
    @Query('remote') remote?: string,
    @Query('category') category?: string,
  ) {
    let remoteValue: boolean | undefined;

    if (remote !== undefined) {
      if (remote !== 'true' && remote !== 'false') {
        throw new BadRequestException(
          'El parámetro remote debe ser true o false',
        );
      }

      remoteValue = remote === 'true';
    }

    return this.jobsService.findAll({
      q,
      location,
      remote: remoteValue,
      category,
    });
  }

  @Post('import')
  importJobs(
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit?: number,
  ) {
    return this.jobsService.importFromPython(limit ?? 20);
  }
}