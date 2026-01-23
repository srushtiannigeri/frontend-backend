import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IpfsService } from './ipfs.service';

@Controller()
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get('ipfs/health')
  async checkIpfsHealth() {
    return this.ipfsService.checkConnection();
  }

  @Post('assets')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // ✅ IMPORTANT
      limits: { fileSize: 25 * 1024 * 1024 }, // optional 25MB
    }),
  )
  async uploadEncryptedAsset(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('type') type: string,
    @Body('content_hash') content_hash: string,
    @Body('wallet_address') wallet_address: string,
    @Body('assigned_nominee_id') assigned_nominee_id: string,
  ) {
    if (!file) {
      throw new BadRequestException('Missing file (expected field "file")');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer missing. Check multer memoryStorage() setup.');
    }

    if (!wallet_address) {
      throw new BadRequestException('Missing wallet_address');
    }

    const asset = await this.ipfsService.storeEncryptedAsset({
      owner_id: wallet_address, // Use wallet address directly
      buffer: file.buffer,
      title: title || file.originalname,
      type: type || file.mimetype,
      content_hash,
      assigned_nominee_id,
    });

    return { asset };
  }
}
