import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { Job } from '../jobs/entities/job.entity';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { CompatibilityDto } from './dto/compatibility.dto';

@Injectable()
export class CompatibilityService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  private buildExplanation(
    compatibility: number,
    matchedSkills: string[],
    missingSkills: string[],
  ): string {
    if (matchedSkills.length === 0) {
      return 'No se detectaron habilidades coincidentes con esta oferta.';
    }

    if (missingSkills.length === 0) {
      return 'Tu perfil coincide con todas las habilidades detectadas en la oferta.';
    }

    return `Coincides en ${matchedSkills.length} habilidad(es) y te faltan ${missingSkills.length}. Compatibilidad: ${compatibility}%.`;
  }  

  async calculate(data: CompatibilityDto) {
    const pythonServiceUrl =
      this.configService.get<string>('PYTHON_SERVICE_URL') ??
      'http://127.0.0.1:8000';

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${pythonServiceUrl}/compatibility`,
          data,
        ),
      );

      return response.data;
    } catch {
      throw new BadGatewayException(
        'No fue posible comunicarse con el servicio de compatibilidad',
      );
    }
  }

  async calculateForJob(
    userId: number,
    jobId: number,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(
        'Oferta no encontrada',
      );
    }

    const result = await this.calculate({
      user_skills: user.skills ?? [],
      job_skills: job.skills ?? [],
    });

    return {
      jobId: job.id,
      title: job.title,
      compatibility: result.compatibility,
      matchedSkills: result.matched_skills,
      missingSkills: result.missing_skills,
      explanation: this.buildExplanation(
        result.compatibility,
        result.matched_skills,
        result.missing_skills,
      ),
    };
  }

}