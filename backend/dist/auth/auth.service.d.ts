import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { WalletAuthDto } from './dto/wallet-auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    private generateToken;
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            user_id: string;
            full_name: string;
            email: string;
            role: UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<{
        token: string;
        user: {
            user_id: string;
            full_name: string;
            email: string;
            role: UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    walletAuth(dto: WalletAuthDto): Promise<{
        token: string;
        user: {
            user_id: string;
            full_name: string;
            email: string;
            role: UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
