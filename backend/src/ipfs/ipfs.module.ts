import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/asset.entity';
import { IpfsService } from './ipfs.service';
import { IpfsController } from './ipfs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [IpfsService],
  controllers: [IpfsController]
})
export class IpfsModule {}


