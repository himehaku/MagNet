import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CompatibilityController } from './compatibility.controller';
import { CompatibilityService } from './compatibility.service';

@Module({
  imports: [HttpModule],
  controllers: [CompatibilityController],
  providers: [CompatibilityService],
})
export class CompatibilityModule {}