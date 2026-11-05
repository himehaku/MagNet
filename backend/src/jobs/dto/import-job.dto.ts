import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ImportJobDto {
  @IsString()
  external_id: string;

  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string | null;

  @IsOptional()
  @IsBoolean()
  remote?: boolean | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsString()
  source: string;

  @IsUrl()
  source_url: string;

  @IsOptional()
  @IsDateString()
  published_at?: string | null;

  @IsDateString()
  fetched_at: string;
}