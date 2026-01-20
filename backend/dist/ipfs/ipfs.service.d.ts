import { Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity';
export declare class IpfsService {
    private readonly assetRepo;
    private ipfs;
    private ipfsApiUrl;
    constructor(assetRepo: Repository<Asset>);
    private getIpfsClient;
    checkConnection(): Promise<{
        connected: boolean;
        apiUrl: string;
        error: string | null;
        details: any;
    }>;
    storeEncryptedAsset(params: {
        owner_id: string;
        buffer: Buffer;
        title: string;
        type?: string;
        content_hash?: string;
        assigned_nominee_id?: string;
    }): Promise<Asset>;
}
