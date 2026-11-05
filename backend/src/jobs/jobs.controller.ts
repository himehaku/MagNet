import {
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
  findAll() {
    return this.jobsService.findAll();
  }

  @Post('import')
  importJobs(
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit?: number,
  ) {
    return this.jobsService.importFromPython(limit ?? 20);
  }
}