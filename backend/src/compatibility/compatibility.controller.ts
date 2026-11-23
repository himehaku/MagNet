import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { CompatibilityService } from './compatibility.service';
import { CompatibilityDto } from './dto/compatibility.dto';

@Controller('compatibility')
export class CompatibilityController {
  constructor(
    private readonly compatibilityService: CompatibilityService,
  ) {}

  @Post()
  calculate(@Body() data: CompatibilityDto) {
    return this.compatibilityService.calculate(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('jobs/:jobId')
  calculateForJob(
    @Req() request: any,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    return this.compatibilityService.calculateForJob(
      request.user.userId,
      jobId,
    );
  }
}