"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    generateToken(user) {
        const payload = {
            user_id: user.user_id,
            role: user.role,
            email: user.email
        };
        return this.jwtService.sign(payload);
    }
    async register(dto) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const password_hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            full_name: dto.full_name,
            email: dto.email,
            password_hash,
            role: dto.role
        });
        const saved = await this.userRepo.save(user);
        const token = this.generateToken(saved);
        const { password_hash: _, ...safeUser } = saved;
        return { token, user: safeUser };
    }
    async validateUser(email, password) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async login(user) {
        const token = this.generateToken(user);
        const { password_hash: _, ...safeUser } = user;
        return { token, user: safeUser };
    }
    async walletAuth(dto) {
        const email = `${dto.wallet_address.toLowerCase()}@wallet.certisure`;
        let user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            const password_hash = await bcrypt.hash(dto.wallet_address, 10);
            user = this.userRepo.create({
                full_name: dto.full_name || `Wallet User ${dto.wallet_address.slice(0, 6)}...${dto.wallet_address.slice(-4)}`,
                email,
                password_hash,
                role: (dto.role || 'OWNER')
            });
            user = await this.userRepo.save(user);
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const token = this.generateToken(user);
        const { password_hash: _, ...safeUser } = user;
        return { token, user: safeUser };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
