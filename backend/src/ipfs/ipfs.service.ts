import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as FormData from 'form-data';
import { Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity';

@Injectable()
export class IpfsService {
  private ipfsApiUrl: string;

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {
    this.ipfsApiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
  }

  // ✅ Health check endpoint support
  async checkConnection() {
    try {
      const res = await axios.post(`${this.ipfsApiUrl}/api/v0/version`);
      return { connected: true, apiUrl: this.ipfsApiUrl, version: res.data };
    } catch (err: any) {
      return {
        connected: false,
        apiUrl: this.ipfsApiUrl,
        error: err?.message || 'IPFS connection failed',
      };
    }
  }

  // ✅ Upload raw buffer to IPFS
  private async uploadToIpfs(
    buffer: Buffer,
    filename = 'file.bin',
  ): Promise<string> {
    try {
      const form = new FormData();
      form.append('file', buffer, { filename });

      const res = await axios.post(`${this.ipfsApiUrl}/api/v0/add`, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });

      // Example response: { Name, Hash, Size }
      return res.data.Hash; // ✅ CID
    } catch (err: any) {
      throw new InternalServerErrorException(
        `IPFS upload failed: ${err?.message || err}`,
      );
    }
  }

  // ✅ NEW: Store file into IPFS MFS so it appears in IPFS Desktop "Files"
  private async addToMfs(cid: string, fileName: string) {
    try {
      // 1) Ensure folder exists
      await axios.post(
        `${this.ipfsApiUrl}/api/v0/files/mkdir?arg=/certisure&parents=true`,
      );

      // 2) Copy CID into MFS path
      // /ipfs/<cid> -> /certisure/<filename>
      await axios.post(
        `${this.ipfsApiUrl}/api/v0/files/cp?arg=/ipfs/${cid}&arg=/certisure/${fileName}`,
      );

      console.log(`✅ Added to MFS: /certisure/${fileName}`);
    } catch (err: any) {
      // MFS is optional — upload + DB already succeeded
      console.warn(
        '⚠️ Failed to add file into MFS (optional):',
        err?.message || err,
      );
    }
  }

  // ✅ Main function called from controller
  async storeEncryptedAsset(params: {
    owner_id: string;
    buffer: Buffer;
    title: string;
    type?: string;
    content_hash?: string;
    assigned_nominee_id?: string;
  }) {
    try {
      // 1) Upload ciphertext to IPFS
      const cid = await this.uploadToIpfs(params.buffer, params.title);

      // 2) ✅ Copy into MFS so it is visible in IPFS Desktop "Files"
      // sanitize filename
      const safeTitle = (params.title || 'encrypted_file')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      const mfsFileName = `${Date.now()}_${safeTitle}`;
      await this.addToMfs(cid, mfsFileName);

      // 3) Save metadata + CID to PostgreSQL
      const asset = this.assetRepo.create({
        owner_id: params.owner_id,
        title: params.title,
        type: params.type ?? null,
        encrypted_cid: cid,
        content_hash: params.content_hash ?? null,
        assigned_nominee_id: params.assigned_nominee_id ?? null,
      });

      return await this.assetRepo.save(asset);
    } catch (err) {
      console.error('IPFS store error', err);
      throw new InternalServerErrorException('Failed to store asset');
    }
  }
}
