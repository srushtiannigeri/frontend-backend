import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity';

@Injectable()
export class IpfsService {
  // Use `any` here to avoid TypeScript/Node ESM interop issues with ipfs-http-client
  private ipfs: any;
  private ipfsApiUrl: string;

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>
  ) {
    this.ipfsApiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
  }

  /**
   * Initialize IPFS client (lazy loading)
   */
  private async getIpfsClient() {
    if (!this.ipfs) {
      try {
        const ipfsModule = await import('ipfs-http-client');
        const createIpfsClient =
          (ipfsModule as any).create ||
          ((ipfsModule as any).default && (ipfsModule as any).default.create) ||
          (ipfsModule as any).default;

        if (typeof createIpfsClient !== 'function') {
          // eslint-disable-next-line no-console
          console.error('ipfs-http-client import shape unexpected:', Object.keys(ipfsModule as any));
          throw new Error('IPFS client factory not found');
        }

        this.ipfs = createIpfsClient({ url: this.ipfsApiUrl });
        // eslint-disable-next-line no-console
        console.log(`IPFS client initialized with URL: ${this.ipfsApiUrl}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize IPFS client:', err);
        throw err;
      }
    }
    return this.ipfs;
  }

  /**
   * Check IPFS connection and return status
   */
  async checkConnection() {
    const status = {
      connected: false,
      apiUrl: this.ipfsApiUrl,
      error: null as string | null,
      details: {} as any
    };

    try {
      const client = await this.getIpfsClient();
      
      // Try to get version info (lightweight check)
      try {
        const version = await client.version();
        status.connected = true;
        status.details.version = version;
      } catch (versionErr: any) {
        status.error = `Version check failed: ${versionErr.message}`;
        status.details.versionError = versionErr.toString();
      }

      // Try to get ID info (more comprehensive check)
      try {
        const id = await client.id();
        status.details.id = {
          id: id.id,
          addresses: id.addresses?.slice(0, 3) || [] // Limit to first 3 addresses
        };
      } catch (idErr: any) {
        status.error = status.error 
          ? `${status.error}; ID check failed: ${idErr.message}`
          : `ID check failed: ${idErr.message}`;
        status.details.idError = idErr.toString();
      }

      // Try a simple add operation with test data
      try {
        const testData = Buffer.from('IPFS connection test');
        const result = await client.add(testData);
        status.details.testAdd = {
          success: true,
          cid: result.cid.toString()
        };
      } catch (addErr: any) {
        status.error = status.error
          ? `${status.error}; Test add failed: ${addErr.message}`
          : `Test add failed: ${addErr.message}`;
        status.details.addError = addErr.toString();
      }

    } catch (initErr: any) {
      status.error = `Failed to initialize IPFS client: ${initErr.message}`;
      status.details.initError = initErr.toString();
      status.details.suggestion = 
        'Make sure IPFS daemon is running. Try: ipfs daemon or check IPFS Desktop is running.';
    }

    return status;
  }

  async storeEncryptedAsset(params: {
    owner_id: string;
    buffer: Buffer;
    title: string;
    type?: string;
    content_hash?: string;
    assigned_nominee_id?: string;
  }) {
    try {
      const client = await this.getIpfsClient();

      let cid: string;
      try {
        const result = await client.add(params.buffer);
        cid = result.cid.toString();
        // eslint-disable-next-line no-console
        console.log(`Successfully uploaded to IPFS. CID: ${cid}`);
      } catch (ipfsErr: any) {
        // eslint-disable-next-line no-console
        console.error('IPFS add failed:', {
          error: ipfsErr.message,
          apiUrl: this.ipfsApiUrl,
          suggestion: 'Check if IPFS daemon is running. Try: GET /api/ipfs/health to diagnose'
        });
        throw new InternalServerErrorException(
          `IPFS upload failed: ${ipfsErr.message}. Check IPFS connection at ${this.ipfsApiUrl}`
        );
      }

      const asset = this.assetRepo.create({
        owner_id: params.owner_id,
        title: params.title,
        type: params.type ?? null,
        encrypted_cid: cid,
        content_hash: params.content_hash ?? null,
        assigned_nominee_id: params.assigned_nominee_id ?? null
      });

      try {
        const saved = await this.assetRepo.save(asset);
        return saved;
      } catch (dbErr) {
        // eslint-disable-next-line no-console
        console.error('Postgres insert into assets failed', {
          owner_id: params.owner_id,
          assigned_nominee_id: params.assigned_nominee_id ?? null
        });
        throw dbErr;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('IPFS store error', err);
      throw new InternalServerErrorException('Failed to store asset');
    }
  }
}


