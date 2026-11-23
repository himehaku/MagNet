import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

export interface UploadedCvFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface CvAnalysisResponse {
  filename: string;
  skills: string[];
  skills_count: number;
  requires_confirmation: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { passwordHash: _, ...result } = user;

    return result;
  }

  async updateProfile(
    userId: number,
    profile: {
      location?: string;
      skills?: string[];
      interests?: string[];
      experienceYears?: number;
      preferredRemote?: boolean;
    },
  ) {
    return this.usersService.updateProfile(userId, profile);
  }  

  async analyzeCv(
    file: UploadedCvFile,
  ): Promise<CvAnalysisResponse> {
    if (!file) {
      throw new BadRequestException(
        'Debes adjuntar un archivo PDF',
      );
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'El archivo debe ser un PDF',
      );
    }

    const pythonServiceUrl =
      this.configService.get<string>(
        'PYTHON_SERVICE_URL',
      ) ?? 'http://127.0.0.1:8000';

    const formData = new FormData();

    formData.append(
      'file',
      new Blob(
        [new Uint8Array(file.buffer)],
        {
          type: file.mimetype,
        },
      ),
      file.originalname,
    );

    try {
      const response =
        await axios.post<CvAnalysisResponse>(
          `${pythonServiceUrl}/cv/analyze`,
          formData,
          {
            timeout: 15000,
          },
        );

      return response.data;
    } catch {
      throw new BadGatewayException(
        'No fue posible analizar el CV',
      );
    }
  }
}