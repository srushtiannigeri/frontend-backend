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
exports.IpfsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const FormData = require("form-data");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("../assets/asset.entity");
let IpfsService = class IpfsService {
    constructor(assetRepo) {
        this.assetRepo = assetRepo;
        this.ipfsApiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
    }
    async checkConnection() {
        try {
            const res = await axios_1.default.post(`${this.ipfsApiUrl}/api/v0/version`);
            return { connected: true, apiUrl: this.ipfsApiUrl, version: res.data };
        }
        catch (err) {
            return {
                connected: false,
                apiUrl: this.ipfsApiUrl,
                error: (err === null || err === void 0 ? void 0 : err.message) || 'IPFS connection failed',
            };
        }
    }
    async uploadToIpfs(buffer, filename = 'file.bin') {
        try {
            const form = new FormData();
            form.append('file', buffer, { filename });
            const res = await axios_1.default.post(`${this.ipfsApiUrl}/api/v0/add`, form, {
                headers: form.getHeaders(),
                maxBodyLength: Infinity,
            });
            return res.data.Hash;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException(`IPFS upload failed: ${(err === null || err === void 0 ? void 0 : err.message) || err}`);
        }
    }
    async addToMfs(cid, fileName) {
        try {
            await axios_1.default.post(`${this.ipfsApiUrl}/api/v0/files/mkdir?arg=/certisure&parents=true`);
            await axios_1.default.post(`${this.ipfsApiUrl}/api/v0/files/cp?arg=/ipfs/${cid}&arg=/certisure/${fileName}`);
            console.log(`✅ Added to MFS: /certisure/${fileName}`);
        }
        catch (err) {
            console.warn('⚠️ Failed to add file into MFS (optional):', (err === null || err === void 0 ? void 0 : err.message) || err);
        }
    }
    async storeEncryptedAsset(params) {
        var _a, _b, _c;
        try {
            const cid = await this.uploadToIpfs(params.buffer, params.title);
            const safeTitle = (params.title || 'encrypted_file')
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9._-]/g, '');
            const mfsFileName = `${Date.now()}_${safeTitle}`;
            await this.addToMfs(cid, mfsFileName);
            const asset = this.assetRepo.create({
                owner_id: params.owner_id,
                title: params.title,
                type: (_a = params.type) !== null && _a !== void 0 ? _a : null,
                encrypted_cid: cid,
                content_hash: (_b = params.content_hash) !== null && _b !== void 0 ? _b : null,
                assigned_nominee_id: (_c = params.assigned_nominee_id) !== null && _c !== void 0 ? _c : null,
            });
            return await this.assetRepo.save(asset);
        }
        catch (err) {
            console.error('IPFS store error', err);
            throw new common_1.InternalServerErrorException('Failed to store asset');
        }
    }
};
exports.IpfsService = IpfsService;
exports.IpfsService = IpfsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IpfsService);
