import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsIn } from 'class-validator';
import { UserRole } from '../../users/user.entity';

const ROLES: UserRole[] = [
  'OWNER',
  'NOMINEE',
  'ACCESS_NOMINEE',
  'VERIFIER',
  'ISSUER',
  'REVIEWER'
];

export class WalletAuthDto {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  full_name?: string;

  @IsString()
  @IsOptional()
  @IsIn(ROLES)
  role?: UserRole;
}
