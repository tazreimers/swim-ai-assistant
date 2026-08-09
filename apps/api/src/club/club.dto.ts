import { ClubRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateClubDto {
  @IsString()
  @Length(2, 120)
  name!: string;
}

export class UpdateClubDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;
}

export class CreateInvitationDto {
  @IsEmail()
  email!: string;

  @IsEnum(ClubRole)
  role!: Exclude<ClubRole, 'OWNER'>;
}

export class CreateSquadDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}

export class UpdateSquadDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  isActive?: boolean;
}

export class AddSquadMemberDto {
  @IsUUID()
  userId!: string;
}
