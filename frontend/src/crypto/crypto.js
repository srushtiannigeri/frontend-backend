// Web Crypto–based client-side encryption/decryption helpers
// AES-GCM for file/content encryption, SHA-256 for integrity.

// Utility: convert between ArrayBuffer and base64 for transport/storage
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function generateAesKey() {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
  const jwk = await crypto.subtle.exportKey('jwk', key);
  return { key, jwk };
}

export async function importAesKeyFromJwk(jwk) {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'AES-GCM'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptBytes(plainBytes, keyOptional) {
  const input =
    plainBytes instanceof ArrayBuffer ? plainBytes : new Uint8Array(plainBytes).buffer;

  const { key, jwk } = keyOptional
    ? { key: keyOptional, jwk: await crypto.subtle.exportKey('jwk', keyOptional) }
    : await generateAesKey();

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    input
  );

  return {
    ciphertext,
    iv,
    key,
    keyJwk: jwk,
    ciphertextBase64: arrayBufferToBase64(ciphertext),
    ivBase64: arrayBufferToBase64(iv.buffer)
  };
}

export async function decryptBytes(ciphertext, iv, keyJwk) {
  const key = await importAesKeyFromJwk(keyJwk);

  const ctBuffer =
    typeof ciphertext === 'string' ? base64ToArrayBuffer(ciphertext) : ciphertext;
  const ivBuffer = typeof iv === 'string' ? base64ToArrayBuffer(iv) : iv;

  const plain = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer)
    },
    key,
    ctBuffer
  );

  return plain;
}

export async function sha256(bytes) {
  const input =
    bytes instanceof ArrayBuffer ? bytes : new Uint8Array(bytes).buffer;
  const digest = await crypto.subtle.digest('SHA-256', input);
  return arrayBufferToBase64(digest); // easy to send/store as string
}

// Example: encrypt a File before upload
export async function encryptFileForUpload(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { ciphertext, iv, keyJwk, ciphertextBase64, ivBase64 } =
    await encryptBytes(arrayBuffer);
  const contentHash = await sha256(ciphertext);

  return {
    ciphertext,
    iv,
    keyJwk,
    ciphertextBase64,
    ivBase64,
    contentHash,
    originalName: file.name,
    mimeType: file.type
  };
}


