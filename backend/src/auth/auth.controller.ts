import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  AuthService,
  UploadedCvFile,
} from './auth.service';

import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() request: any) {
    return this.authService.getProfile(request.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(
    @Req() request: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(
      request.user.userId,
      updateProfileDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile/cv')
  @UseInterceptors(FileInterceptor('file'))
  analyzeCv(
    @UploadedFile() file: UploadedCvFile,
  ) {
    return this.authService.analyzeCv(file);
  }

}