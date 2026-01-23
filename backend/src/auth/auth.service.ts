import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { WalletAuthDto } from './dto/wallet-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  private generateToken(user: User) {
    const payload = {
      user_id: user.user_id,
      role: user.role,
      email: user.email
    };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      password_hash,
      role: dto.role as UserRole
    });

    const saved = await this.userRepo.save(user);
    const token = this.generateToken(saved);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...safeUser } = saved;
    return { token, user: safeUser };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    const token = this.generateToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  // Wallet-based authentication (no password required)
  async walletAuth(dto: WalletAuthDto) {
    // Use wallet address as email identifier
    const email = `${dto.wallet_address.toLowerCase()}@wallet.certisure`;
    
    // Check if user exists
    let user = await this.userRepo.findOne({ where: { email } });
    
    if (!user) {
      // Create new user with wallet address
      const password_hash = await bcrypt.hash(dto.wallet_address, 10); // Use wallet as password hash
      
      user = this.userRepo.create({
        full_name: dto.full_name || `Wallet User ${dto.wallet_address.slice(0, 6)}...${dto.wallet_address.slice(-4)}`,
        email,
        password_hash,
        role: (dto.role || 'OWNER') as UserRole
      });
      
      user = await this.userRepo.save(user);
    }
    
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }
    
    const token = this.generateToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }
}


