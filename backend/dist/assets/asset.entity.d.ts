import { User } from '../users/user.entity';
export declare class Asset {
    asset_id: string;
    owner: User;
    owner_id: string;
    title: string;
    type: string | null;
    encrypted_cid: string;
    content_hash: string | null;
    assigned_nominee: User | null;
    assigned_nominee_id: string | null;
    created_at: Date;
}
