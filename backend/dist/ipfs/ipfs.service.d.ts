import { Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity';
export declare class IpfsService {
    private readonly assetRepo;
    private ipfsApiUrl;
    constructor(assetRepo: Repository<Asset>);
    checkConnection(): Promise<{
        connected: boolean;
        apiUrl: string;
        version: any;
        error?: undefined;
    } | {
        connected: boolean;
        apiUrl: string;
        error: any;
        version?: undefined;
    }>;
    private uploadToIpfs;
    private addToMfs;
    storeEncryptedAsset(params: {
        owner_id: string;
        buffer: Buffer;
        title: string;
        type?: string;
        content_hash?: string;
        assigned_nominee_id?: string;
    }): Promise<Asset>;
}
