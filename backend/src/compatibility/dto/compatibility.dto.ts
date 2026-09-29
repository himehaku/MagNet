import { IsArray, IsString } from 'class-validator';

export class CompatibilityDto {
  @IsArray()
  @IsString({ each: true })
  user_skills!: string[];

  @IsArray()
  @IsString({ each: true })
  job_skills!: string[];
}