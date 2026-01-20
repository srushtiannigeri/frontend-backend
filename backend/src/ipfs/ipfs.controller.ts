import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsService } from './ipfs.service';

@Controller()
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get('ipfs/health')
  async checkIpfsHealth() {
    return this.ipfsService.checkConnection();
  }

  // NOTE: For demo purposes, this endpoint is left unauthenticated and expects owner_id in the body.
  // In production, protect with JwtAuthGuard + RolesGuard and derive owner_id from req.user.
  @Post('assets')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEncryptedAsset(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('type') type: string,
    @Body('content_hash') content_hash: string,
    @Body('assigned_nominee_id') assigned_nominee_id: string,
    @Body('owner_id') owner_id: string
  ) {
    if (!file) {
      throw new BadRequestException('Missing file (expected field \"file\")');
    }

    if (!owner_id) {
      throw new BadRequestException('Missing owner_id in form data');
    }

    const asset = await this.ipfsService.storeEncryptedAsset({
      owner_id,
      buffer: file.buffer,
      title: title || file.originalname,
      type: type || file.mimetype,
      content_hash,
      assigned_nominee_id
    });

    return { asset };
  }
}


