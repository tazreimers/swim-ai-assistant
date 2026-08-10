import {
  IsArray,
  IsDateString,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export class MainSetDto {
  @IsInt()
  @Min(1)
  position!: number;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  stroke?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  distanceMeters?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  repetitions!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3600)
  sendOffSeconds?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}

export class CreateSessionDto {
  @IsUUID()
  clubId!: string;

  @IsUUID()
  squadId!: string;

  @IsString()
  @Length(2, 160)
  title!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsString()
  @Length(2, 60)
  sessionType!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MainSetDto)
  mainSets!: MainSetDto[];
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  @Length(2, 160)
  title?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  sessionType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MainSetDto)
  mainSets?: MainSetDto[];
}

export class PhotoUploadDto {
  @IsString()
  @Length(1, 200)
  fileName!: string;

  @IsIn(imageTypes)
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;
}

export class PhotoCompleteDto {
  @IsString()
  @Length(1, 500)
  storagePath!: string;

  @IsIn(imageTypes)
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;
}

export class RepResultDto {
  @IsUUID()
  mainSetId!: string;

  @IsInt()
  @Min(1)
  repNumber!: number;

  @IsInt()
  @Min(1)
  @Max(3600000)
  timeMs!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}

export class SaveResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepResultDto)
  reps!: RepResultDto[];
}
