import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Get('health')
  async health() {
    // Simple DB check
    await this.userRepo.query('SELECT 1');
    return { status: 'ok' };
  }
}


