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
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("../assets/asset.entity");
let IpfsService = class IpfsService {
    constructor(assetRepo) {
        this.assetRepo = assetRepo;
        this.ipfsApiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
    }
    async getIpfsClient() {
        if (!this.ipfs) {
            try {
                const ipfsModule = await Promise.resolve().then(() => require('ipfs-http-client'));
                const createIpfsClient = ipfsModule.create ||
                    (ipfsModule.default && ipfsModule.default.create) ||
                    ipfsModule.default;
                if (typeof createIpfsClient !== 'function') {
                    console.error('ipfs-http-client import shape unexpected:', Object.keys(ipfsModule));
                    throw new Error('IPFS client factory not found');
                }
                this.ipfs = createIpfsClient({ url: this.ipfsApiUrl });
                console.log(`IPFS client initialized with URL: ${this.ipfsApiUrl}`);
            }
            catch (err) {
                console.error('Failed to initialize IPFS client:', err);
                throw err;
            }
        }
        return this.ipfs;
    }
    async checkConnection() {
        var _a;
        const status = {
            connected: false,
            apiUrl: this.ipfsApiUrl,
            error: null,
            details: {}
        };
        try {
            const client = await this.getIpfsClient();
            try {
                const version = await client.version();
                status.connected = true;
                status.details.version = version;
            }
            catch (versionErr) {
                status.error = `Version check failed: ${versionErr.message}`;
                status.details.versionError = versionErr.toString();
            }
            try {
                const id = await client.id();
                status.details.id = {
                    id: id.id,
                    addresses: ((_a = id.addresses) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || []
                };
            }
            catch (idErr) {
                status.error = status.error
                    ? `${status.error}; ID check failed: ${idErr.message}`
                    : `ID check failed: ${idErr.message}`;
                status.details.idError = idErr.toString();
            }
            try {
                const testData = Buffer.from('IPFS connection test');
                const result = await client.add(testData);
                status.details.testAdd = {
                    success: true,
                    cid: result.cid.toString()
                };
            }
            catch (addErr) {
                status.error = status.error
                    ? `${status.error}; Test add failed: ${addErr.message}`
                    : `Test add failed: ${addErr.message}`;
                status.details.addError = addErr.toString();
            }
        }
        catch (initErr) {
            status.error = `Failed to initialize IPFS client: ${initErr.message}`;
            status.details.initError = initErr.toString();
            status.details.suggestion =
                'Make sure IPFS daemon is running. Try: ipfs daemon or check IPFS Desktop is running.';
        }
        return status;
    }
    async storeEncryptedAsset(params) {
        var _a, _b, _c, _d;
        try {
            const client = await this.getIpfsClient();
            let cid;
            try {
                const result = await client.add(params.buffer);
                cid = result.cid.toString();
                console.log(`Successfully uploaded to IPFS. CID: ${cid}`);
            }
            catch (ipfsErr) {
                console.error('IPFS add failed:', {
                    error: ipfsErr.message,
                    apiUrl: this.ipfsApiUrl,
                    suggestion: 'Check if IPFS daemon is running. Try: GET /api/ipfs/health to diagnose'
                });
                throw new common_1.InternalServerErrorException(`IPFS upload failed: ${ipfsErr.message}. Check IPFS connection at ${this.ipfsApiUrl}`);
            }
            const asset = this.assetRepo.create({
                owner_id: params.owner_id,
                title: params.title,
                type: (_a = params.type) !== null && _a !== void 0 ? _a : null,
                encrypted_cid: cid,
                content_hash: (_b = params.content_hash) !== null && _b !== void 0 ? _b : null,
                assigned_nominee_id: (_c = params.assigned_nominee_id) !== null && _c !== void 0 ? _c : null
            });
            try {
                const saved = await this.assetRepo.save(asset);
                return saved;
            }
            catch (dbErr) {
                console.error('Postgres insert into assets failed', {
                    owner_id: params.owner_id,
                    assigned_nominee_id: (_d = params.assigned_nominee_id) !== null && _d !== void 0 ? _d : null
                });
                throw dbErr;
            }
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
