import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { CompatibilityDto } from './dto/compatibility.dto';

@Injectable()
export class CompatibilityService {
  constructor(private readonly httpService: HttpService) {}

  async calculate(data: CompatibilityDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://127.0.0.1:8000/compatibility',
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