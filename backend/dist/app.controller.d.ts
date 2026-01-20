import { Repository } from 'typeorm';
import { User } from './users/user.entity';
export declare class AppController {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    health(): Promise<{
        status: string;
    }>;
}
