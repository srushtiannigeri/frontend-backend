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
exports.IpfsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ipfs_service_1 = require("./ipfs.service");
let IpfsController = class IpfsController {
    constructor(ipfsService) {
        this.ipfsService = ipfsService;
    }
    async checkIpfsHealth() {
        return this.ipfsService.checkConnection();
    }
    async uploadEncryptedAsset(file, title, type, content_hash, assigned_nominee_id, owner_id) {
        if (!file) {
            throw new common_1.BadRequestException('Missing file (expected field \"file\")');
        }
        if (!owner_id) {
            throw new common_1.BadRequestException('Missing owner_id in form data');
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
};
exports.IpfsController = IpfsController;
__decorate([
    (0, common_1.Get)('ipfs/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IpfsController.prototype, "checkIpfsHealth", null);
__decorate([
    (0, common_1.Post)('assets'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Body)('content_hash')),
    __param(4, (0, common_1.Body)('assigned_nominee_id')),
    __param(5, (0, common_1.Body)('owner_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], IpfsController.prototype, "uploadEncryptedAsset", null);
exports.IpfsController = IpfsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ipfs_service_1.IpfsService])
], IpfsController);
