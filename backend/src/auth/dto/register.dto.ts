import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../../users/user.entity';

const ROLES: UserRole[] = [
  'OWNER',
  'NOMINEE',
  'ACCESS_NOMINEE',
  'VERIFIER',
  'ISSUER',
  'REVIEWER'
];

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(ROLES)
  role: UserRole;
}


