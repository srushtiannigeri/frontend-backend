export type UserRole = 'OWNER' | 'NOMINEE' | 'ACCESS_NOMINEE' | 'VERIFIER' | 'ISSUER' | 'REVIEWER';
export declare class User {
    user_id: string;
    full_name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
