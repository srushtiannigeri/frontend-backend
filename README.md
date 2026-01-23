Certisure / DataNominee – Integrated Backend & Frontend
========================================================

This repo contains a **fully integrated implementation** for:

- **Backend (NestJS)**:
  - PostgreSQL `users` table with protocol roles (OWNER, NOMINEE, ACCESS_NOMINEE, VERIFIER, ISSUER, REVIEWER)
  - User registration & login with bcrypt password hashing and JWT auth
  - IPFS integration for **storing encrypted blobs** (ciphertext with IV prepended)
  - JWT-protected endpoints for secure file uploads
- **Frontend (React + Vite)**:
  - Client‑side AES‑GCM encryption/decryption using the Web Crypto API
  - SHA‑256 hashing of ciphertext for integrity
  - Wallet integration (Web3Auth) for cryptographic signatures
  - Full integration with backend API for file encryption, IPFS storage, and database operations

> Important: This implementation demonstrates **core building blocks**. You must harden, test, and extend it before production use (rate limiting, CSRF, refresh tokens, key‑management UX, etc.).

Project layout
--------------

- `backend/` – NestJS backend
  - `package.json` – backend dependencies
  - `src/`
    - `main.ts` – server bootstrap with CORS
    - `app.module.ts` – main application module
    - `auth/` – JWT authentication module
    - `ipfs/` – IPFS service and controller
    - `assets/` – Asset entity for database
    - `users/` – User entity
  - `migrations/001_init.sql` – PostgreSQL schema
- `web-frontend/` – React frontend
  - `package.json` – frontend dependencies
  - `src/`
    - `lib/api.ts` – API service for backend communication
    - `lib/decryption.ts` – Decryption utilities
    - `contexts/AuthContext.tsx` – Authentication context
    - `components/EncryptedUpload.tsx` – File encryption and upload component
    - `components/Dashboard.tsx` – Main dashboard with asset management
    - `pages/Login.tsx` – Login/registration page
- `frontend/` – Legacy crypto helpers (reference implementation)
  - `src/crypto/crypto.js` – Client‑side encryption/decryption helpers

Quick Start
-----------

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment (create `.env` in `backend/` based on `.env.example`):

```bash
POSTGRES_URL=postgresql://user:password@localhost:5432/certisure
JWT_SECRET=your-super-secret-jwt-key-change-in-production
IPFS_API_URL=http://127.0.0.1:5001
PORT=4000
```

3. Apply migrations to PostgreSQL:

```bash
psql "$POSTGRES_URL" -f migrations/001_init.sql
```

4. Run the backend:

```bash
cd backend
npm run start:dev
```

The backend will start on `http://localhost:4000` (or the port specified in `.env`).

### Frontend Setup

1. Install dependencies:

```bash
cd web-frontend
npm install
```

2. Configure environment (create `.env` in `web-frontend/` based on `.env.example`):

```bash
VITE_API_URL=http://localhost:4000/api
```

3. Run the frontend:

```bash
cd web-frontend
npm run dev
```

The frontend will start on `http://localhost:8080` (or the port specified in `vite.config.ts`).

### IPFS Setup

Make sure IPFS is running locally:

```bash
# Install IPFS if not already installed
# Then start IPFS daemon
ipfs daemon
```

The backend expects IPFS API at `http://127.0.0.1:5001` by default.

Key backend endpoints
---------------------

- `GET /health`
  - Health check endpoint (verifies database connectivity)

- `GET /ipfs/health`
  - IPFS connection health check
  - Returns: `{ connected, apiUrl, error, details }`
  - Tests IPFS API connectivity, version, peer ID, and test upload
  - Use this to verify IPFS is running and accessible

- `POST /auth/register`
  - Body: `{ full_name, email, password, role }`
  - Creates a user with one of the allowed roles:
    - `OWNER`, `NOMINEE`, `ACCESS_NOMINEE`, `VERIFIER`, `ISSUER`, `REVIEWER`
- `POST /auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token, user }` – JWT includes `user_id` and `role`
- `POST /api/assets` (Protected with JWT)
  - Auth: `Authorization: Bearer <token>` (required)
  - Expects **already‑encrypted** file upload (`multipart/form-data` field `file`) and optional metadata.
  - File format: First 12 bytes = IV, rest = ciphertext (AES-GCM encrypted)
  - Stores the encrypted blob (IV + ciphertext) on IPFS, records CID + metadata in PostgreSQL.
  - Returns: `{ asset: { asset_id, owner_id, title, encrypted_cid, content_hash, created_at } }`

Integration Flow
----------------

The frontend and backend are fully integrated. Here's how file encryption and storage works:

### File Upload Flow

1. **User Authentication**: User logs in via Web3Auth wallet connection, then completes backend registration/login
2. **File Selection**: User selects a file in the `EncryptedUpload` component
3. **Encryption**: 
   - File is encrypted client-side using AES-GCM-256
   - IV (12 bytes) is prepended to the ciphertext
   - Content hash (SHA-256) is computed for integrity verification
4. **Wallet Signature**: User signs a message with their wallet (required for key wrapping)
5. **Key Wrapping**: AES key is wrapped using the wallet signature
6. **Upload**: Encrypted file (IV + ciphertext) is uploaded to `/api/assets` with JWT authentication
7. **IPFS Storage**: Backend stores the encrypted blob on IPFS and records metadata in PostgreSQL
8. **Completion**: Frontend receives the asset record with IPFS CID

### File Decryption

The `web-frontend/src/lib/decryption.ts` file provides utilities for decrypting stored files:

- `extractIvAndCiphertext()` – Separates IV and ciphertext from the combined blob
- `decryptStoredFile()` – Decrypts using the wrapped key and wallet address
- `downloadAndDecryptFile()` – Downloads from IPFS and decrypts (placeholder for IPFS gateway integration)

### Key Storage

The wrapped key (containing the AES key encrypted with wallet signature) is stored client-side in localStorage along with asset metadata. In production, consider more secure key management strategies.

### Legacy Crypto Helpers

The `frontend/src/crypto/crypto.js` file contains reference implementations:

- `generateAesKey()` – creates a random AES‑GCM key
- `encryptBytes(plainBytes)` – returns `{ ciphertext, iv, keyJwk }`
- `decryptBytes(ciphertext, iv, keyJwk)` – recovers the plaintext
- `sha256(bytes)` – computes a SHA‑256 hash


