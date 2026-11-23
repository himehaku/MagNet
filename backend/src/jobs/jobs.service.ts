import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { ImportJobDto } from './dto/import-job.dto';
import { Job } from './entities/job.entity';

interface PythonJobsResponse {
  source: string;
  count: number;
  jobs: ImportJobDto[];
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(filters: {
    q?: string;
    location?: string;
    remote?: boolean;
    category?: string;
  }): Promise<Job[]> {
    const query = this.jobsRepository
      .createQueryBuilder('job')
      .orderBy('job.publishedAt', 'DESC');

    const q = filters.q?.trim();

    if (q) {
      query.andWhere(
        `(
          job.title ILIKE :search
          OR job.company ILIKE :search
          OR job.description ILIKE :search
        )`,
        {
          search: `%${q}%`,
        },
      );
    }

    const location = filters.location?.trim();

    if (location) {
      query.andWhere(
        'job.location ILIKE :location',
        {
          location: `%${location}%`,
        },
      );
    }

  if (filters.remote !== undefined) {
    query.andWhere(
      'job.remote = :remote',
      {
        remote: filters.remote,
      },
    );
  }

  const category = filters.category?.trim();

  if (category) {
    query.andWhere(
      'job.category ILIKE :category',
      {
        category: `%${category}%`,
      },
    );
  }

  return query.getMany();
}

  async importFromPython(limit = 20) {
    const pythonServiceUrl =
      this.configService.get<string>('PYTHON_SERVICE_URL') ??
      'http://127.0.0.1:8000';

    let response: { data: PythonJobsResponse };

    try {
      response = await axios.get<PythonJobsResponse>(
        `${pythonServiceUrl}/jobs/fetch`,
        {
          params: {
            limit,
          },
          timeout: 10000,
        },
      );
    } catch {
      throw new BadGatewayException(
        'No fue posible obtener ofertas desde el servicio Python',
      );
    }

    let created = 0;
    let updated = 0;

    for (const jobDto of response.data.jobs) {
      const existingJob = await this.jobsRepository.findOne({
        where: {
          source: jobDto.source,
          externalId: jobDto.external_id,
        },
      });

      const jobData = {
        externalId: jobDto.external_id,
        title: jobDto.title,
        company: jobDto.company,
        description: jobDto.description,
        location: jobDto.location ?? null,
        remote: jobDto.remote ?? null,
        category: jobDto.category ?? null,
        skills: jobDto.skills ?? [],
        source: jobDto.source,
        sourceUrl: jobDto.source_url,
        publishedAt: jobDto.published_at
          ? new Date(jobDto.published_at)
          : null,
        fetchedAt: new Date(jobDto.fetched_at),
      };

      if (existingJob) {
        Object.assign(existingJob, jobData);

        await this.jobsRepository.save(existingJob);

        updated++;
      } else {
        const newJob = this.jobsRepository.create(jobData);

        await this.jobsRepository.save(newJob);

        created++;
      }
    }

    return {
      source: response.data.source,
      received: response.data.count,
      created,
      updated,
    };
  }
}