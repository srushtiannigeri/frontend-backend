// Utility functions for decrypting files stored in IPFS
// The encrypted file format is: [12 bytes IV][ciphertext]

/**
 * Extracts IV and ciphertext from the combined encrypted blob
 * Format: First 12 bytes = IV, rest = ciphertext
 */
export function extractIvAndCiphertext(combinedBuffer: ArrayBuffer): { iv: Uint8Array; ciphertext: ArrayBuffer } {
  const combined = new Uint8Array(combinedBuffer);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12).buffer;
  return { iv, ciphertext };
}

/**
 * Decrypts a file that was encrypted with AES-GCM and stored in IPFS
 * @param encryptedBlob - The combined IV + ciphertext blob
 * @param wrappedKeyBase64 - The wrapped key from the upload (base64 encoded JSON)
 * @param walletAddress - The wallet address that signed the key
 */
export async function decryptStoredFile(
  encryptedBlob: ArrayBuffer,
  wrappedKeyBase64: string,
  walletAddress: string
): Promise<ArrayBuffer> {
  // 1. Extract IV and ciphertext
  const { iv, ciphertext } = extractIvAndCiphertext(encryptedBlob);

  // 2. Parse the wrapped key
  const wrappedKeyData = JSON.parse(atob(wrappedKeyBase64));
  if (wrappedKeyData.owner !== walletAddress) {
    throw new Error('Wrapped key owner does not match wallet address');
  }

  // 3. Extract the raw key hex from the wrapped key
  // Format: "sig_locked_<hex>"
  const rawKeyHex = wrappedKeyData.ciphertext.replace('sig_locked_', '');
  const rawKeyBytes = new Uint8Array(
    rawKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  // 4. Import the AES key
  const key = await window.crypto.subtle.importKey(
    'raw',
    rawKeyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 5. Decrypt
  const plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return plaintext;
}

/**
 * Downloads and decrypts a file from IPFS
 * @param ipfsCid - The IPFS CID of the encrypted file
 * @param wrappedKeyBase64 - The wrapped key from upload
 * @param walletAddress - The wallet address
 * @param fileName - Optional filename for the download
 */
export async function downloadAndDecryptFile(
  ipfsCid: string,
  wrappedKeyBase64: string,
  walletAddress: string,
  fileName?: string
): Promise<void> {
  // Note: In production, you'd fetch from IPFS gateway
  // For now, this is a placeholder for the decryption logic
  // You'll need to implement IPFS fetching based on your setup
  
  // Example IPFS gateway URL (adjust based on your setup):
  // const ipfsUrl = `https://ipfs.io/ipfs/${ipfsCid}`;
  // const response = await fetch(ipfsUrl);
  // const encryptedBlob = await response.arrayBuffer();
  
  // const decrypted = await decryptStoredFile(encryptedBlob, wrappedKeyBase64, walletAddress);
  
  // Create download link
  // const blob = new Blob([decrypted]);
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = fileName || 'decrypted_file';
  // a.click();
  // URL.revokeObjectURL(url);
  
  throw new Error('IPFS download not yet implemented. Use IPFS gateway to fetch the file first.');
}
