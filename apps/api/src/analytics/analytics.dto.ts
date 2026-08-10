import { IsDateString, IsOptional } from 'class-validator';

export class ProgressQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
