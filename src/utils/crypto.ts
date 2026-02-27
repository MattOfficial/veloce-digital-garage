import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// The key must be exactly 32 bytes (256 bits). We expect it to be provided as a hex string in the env var.
function getMasterKey(): Buffer {
    const hexKey = process.env.ENCRYPTION_MASTER_KEY;
    if (!hexKey) {
        throw new Error("CRITICAL SECURITY ERROR: ENCRYPTION_MASTER_KEY environment variable is not set.");
    }

    const key = Buffer.from(hexKey, 'hex');
    if (key.length !== 32) {
        throw new Error("CRITICAL SECURITY ERROR: ENCRYPTION_MASTER_KEY must be exactly 32 bytes (64 hex characters).");
    }
    return key;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * @returns {string} The encrypted string in the format "iv:authTag:ciphertext" (all hex encoded)
 */
export function encrypt(text: string): string {
    const key = getMasterKey();
    const iv = crypto.randomBytes(16); // 16 bytes is standard for GCM

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // Return the required components concatenated with a colon
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * @param {string} encryptedString - The string returned by `encrypt()` (format: "iv:authTag:ciphertext")
 * @returns {string} The decrypted plaintext
 */
export function decrypt(encryptedString: string): string {
    const key = getMasterKey();

    const parts = encryptedString.split(':');
    if (parts.length !== 3) {
        throw new Error("Invalid encrypted string format. Expected 'iv:authTag:ciphertext'.");
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
