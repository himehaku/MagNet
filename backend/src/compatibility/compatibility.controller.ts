import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

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
}