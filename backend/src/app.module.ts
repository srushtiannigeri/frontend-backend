import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/user.entity';
import { Asset } from './assets/asset.entity';
import { AuthModule } from './auth/auth.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.POSTGRES_URL,
        entities: [User, Asset],
        synchronize: false, // use SQL migrations instead
        logging: false
      })
    }),
    TypeOrmModule.forFeature([User, Asset]),
    AuthModule,
    IpfsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}


