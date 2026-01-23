import { IpfsService } from './ipfs.service';
export declare class IpfsController {
    private readonly ipfsService;
    constructor(ipfsService: IpfsService);
    checkIpfsHealth(): Promise<{
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
    uploadEncryptedAsset(file: Express.Multer.File, title: string, type: string, content_hash: string, wallet_address: string, assigned_nominee_id: string): Promise<{
        asset: import("../assets/asset.entity").Asset;
    }>;
}
