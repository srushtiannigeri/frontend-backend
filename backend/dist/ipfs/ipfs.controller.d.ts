import { IpfsService } from './ipfs.service';
export declare class IpfsController {
    private readonly ipfsService;
    constructor(ipfsService: IpfsService);
    checkIpfsHealth(): Promise<{
        connected: boolean;
        apiUrl: string;
        error: string | null;
        details: any;
    }>;
    uploadEncryptedAsset(file: Express.Multer.File, title: string, type: string, content_hash: string, assigned_nominee_id: string, owner_id: string): Promise<{
        asset: import("../assets/asset.entity").Asset;
    }>;
}
