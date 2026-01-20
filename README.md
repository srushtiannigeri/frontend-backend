Certisure / DataNominee – Starter Backend & Crypto Setup
========================================================

This repo contains a **minimal starter implementation** for:

- **Backend (Bun/Node + Express style)**:
  - PostgreSQL `users` table with protocol roles (OWNER, NOMINEE, ACCESS_NOMINEE, VERIFIER, ISSUER, REVIEWER)
  - Basic registration & login with bcrypt password hashing and JWT auth
  - IPFS integration for **storing encrypted blobs** (ciphertext only)
- **Frontend crypto helper**:
  - Client‑side AES‑GCM encryption/decryption using the Web Crypto API
  - SHA‑256 hashing of ciphertext for integrity

> Important: This starter only demonstrates **core building blocks**. You must harden, test, and extend it before production use (rate limiting, CSRF, refresh tokens, key‑management UX, etc.).

Project layout
--------------

- `backend/`
  - `package.json` – backend dependencies
  - `src/`
    - `index.js` – server bootstrap
    - `db.js` – PostgreSQL client
    - `auth.js` – user registration/login and JWT middleware
    - `ipfs.js` – IPFS upload endpoint (expects encrypted data)
  - `migrations/001_init.sql` – PostgreSQL schema (including `users` with protocol roles)
- `frontend/`
  - `package.json` – frontend dependencies
  - `src/crypto/crypto.js` – client‑side encryption/decryption helpers

Backend – quick start
---------------------

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment (create `.env` in `backend/`):

```bash
POSTGRES_URL=postgres://user:password@localhost:5432/certisure
JWT_SECRET=super-secret-jwt-key
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
npm start
```

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
- `POST /assets`
  - Auth: `Authorization: Bearer <token>` (currently optional for demo)
  - Expects **already‑encrypted** file upload (`multipart/form-data` field `file`) and optional metadata.
  - Stores the ciphertext on IPFS, records CID + metadata in PostgreSQL.

Frontend crypto helpers
-----------------------

The `frontend/src/crypto/crypto.js` file exposes:

- `generateAesKey()` – creates a random AES‑GCM key
- `encryptBytes(plainBytes)` – returns `{ ciphertext, iv, keyJwk }`
- `decryptBytes(ciphertext, iv, keyJwk)` – recovers the plaintext
- `sha256(bytes)` – computes a SHA‑256 hash (for integrity / `content_hash`)

You can wire these helpers into your React/Next.js file upload flow:

1. Read the file as `ArrayBuffer`
2. Encrypt it with `encryptBytes`
3. Compute `content_hash = sha256(ciphertext)`
4. Upload **ciphertext only** to `/assets` along with hash and metadata
5. Store key material client‑side (or in a separate, encrypted channel) according to your protocol.


