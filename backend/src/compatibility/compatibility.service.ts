import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { CompatibilityDto } from './dto/compatibility.dto';

@Injectable()
export class CompatibilityService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
}