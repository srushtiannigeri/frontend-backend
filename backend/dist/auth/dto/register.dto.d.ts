import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    full_name: string;
    email: string;
    password: string;
    role: UserRole;
}
