import { UserRole } from '../../users/user.entity';
export declare class WalletAuthDto {
    wallet_address: string;
    full_name?: string;
    role?: UserRole;
}
