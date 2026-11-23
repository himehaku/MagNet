import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompatibilityController } from './compatibility.controller';
import { CompatibilityService } from './compatibility.service';

import { UsersModule } from '../users/users.module';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [CompatibilityController],
  providers: [CompatibilityService],
})
export class CompatibilityModule {}