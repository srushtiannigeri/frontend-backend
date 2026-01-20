import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            user_id: string;
            full_name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            user_id: string;
            full_name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
