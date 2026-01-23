const Minio = require('minio');
const fs = require('fs-extra');
const path = require('path');
const { Readable } = require('stream');

/**
 * PRODUCTION STORAGE SERVICE
 * 
 * Redis is for TASK METADATA ONLY (queue state, DAG state, consensus flags)
 * MinIO/S3 is for ACTUAL COMPUTATION RESULTS (large data, files, outputs)
 * 
 * Why?
 * - Redis has ~512MB value limit
 * - Storing GBs of computation results in Redis = CRASH
 * - MinIO is object storage designed for this
 */
class StorageService {
    constructor() {
        // MinIO client (S3-compatible)
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '9000'),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
            secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
        });

        this.bucketName = 'anchor-results';
        this._ensureBucket();
    }

    async _ensureBucket() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                console.log(`[STORAGE] Created bucket: ${this.bucketName}`);
            }
        } catch (err) {
            console.error('[STORAGE] MinIO connection failed:', err.message);
            console.warn('[STORAGE] Falling back to filesystem storage');
            this.useFilesystem = true;
        }
    }

    /**
     * Store computation result (can be GBs of data)
     * @param {string} taskId - Task identifier
     * @param {Buffer|Stream|Object} data - Result data
     * @param {object} metadata - Optional metadata
     */
    async storeResult(taskId, data, metadata = {}) {
        const objectName = `results/${taskId}.bin`;

        try {
            if (this.useFilesystem) {
                // Fallback: Store on local filesystem
                const filePath = path.join(process.cwd(), 'storage', objectName);
                await fs.ensureDir(path.dirname(filePath));

                if (Buffer.isBuffer(data)) {
                    await fs.writeFile(filePath, data);
                } else if (typeof data === 'object') {
                    await fs.writeJson(filePath, data);
                }

                console.log(`[STORAGE] Stored ${taskId} to filesystem (${filePath})`);
                return { location: 'filesystem', path: filePath };
            }

            // Production: Store in MinIO
            let stream;
            let size;

            if (Buffer.isBuffer(data)) {
                stream = Readable.from(data);
                size = data.length;
            } else if (typeof data === 'object') {
                const jsonBuffer = Buffer.from(JSON.stringify(data));
                stream = Readable.from(jsonBuffer);
                size = jsonBuffer.length;
            } else {
                stream = data;
                size = undefined; // Unknown size for streams
            }

            await this.minioClient.putObject(
                this.bucketName,
                objectName,
                stream,
                size,
                {
                    'Content-Type': 'application/octet-stream',
                    'x-amz-meta-task-id': taskId,
                    ...metadata
                }
            );

            console.log(`[STORAGE] Stored ${taskId} to MinIO (${size} bytes)`);
            return {
                location: 'minio',
                bucket: this.bucketName,
                object: objectName,
                size
            };

        } catch (err) {
            console.error(`[STORAGE] Failed to store ${taskId}:`, err.message);
            throw err;
        }
    }

    /**
     * Retrieve computation result
     * @param {string} taskId - Task identifier
     * @returns {Promise<Buffer>} Result data
     */
    async getResult(taskId) {
        const objectName = `results/${taskId}.bin`;

        try {
            if (this.useFilesystem) {
                const filePath = path.join(process.cwd(), 'storage', objectName);

                if (await fs.pathExists(filePath)) {
                    const ext = path.extname(filePath);
                    if (ext === '.json') {
                        return await fs.readJson(filePath);
                    }
                    return await fs.readFile(filePath);
                }
                throw new Error('Result not found in filesystem');
            }

            // Production: Get from MinIO
            const chunks = [];
            const stream = await this.minioClient.getObject(this.bucketName, objectName);

            return new Promise((resolve, reject) => {
                stream.on('data', chunk => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', reject);
            });

        } catch (err) {
            console.error(`[STORAGE] Failed to retrieve ${taskId}:`, err.message);
            throw err;
        }
    }

    /**
     * Get a presigned URL for direct download (no proxy through backend)
     * @param {string} taskId - Task identifier
     * @param {number} expirySeconds - URL expiry time
     * @returns {Promise<string>} Presigned URL
     */
    async getPresignedUrl(taskId, expirySeconds = 3600) {
        if (this.useFilesystem) {
            // For filesystem, we'd need to serve via HTTP endpoint
            return `/api/storage/download/${taskId}`;
        }

        const objectName = `results/${taskId}.bin`;

        try {
            const url = await this.minioClient.presignedGetObject(
                this.bucketName,
                objectName,
                expirySeconds
            );

            console.log(`[STORAGE] Generated presigned URL for ${taskId} (expires in ${expirySeconds}s)`);
            return url;

        } catch (err) {
            console.error(`[STORAGE] Failed to generate presigned URL:`, err.message);
            throw err;
        }
    }

    /**
     * Store large file from stream (for multi-GB results)
     * @param {string} taskId - Task identifier
     * @param {ReadableStream} stream - Data stream
     * @param {number} size - File size in bytes
     */
    async storeStream(taskId, stream, size) {
        const objectName = `results/${taskId}.bin`;

        try {
            if (this.useFilesystem) {
                const filePath = path.join(process.cwd(), 'storage', objectName);
                await fs.ensureDir(path.dirname(filePath));

                const writeStream = fs.createWriteStream(filePath);
                stream.pipe(writeStream);

                return new Promise((resolve, reject) => {
                    writeStream.on('finish', () => {
                        console.log(`[STORAGE] Streamed ${taskId} to filesystem`);
                        resolve({ location: 'filesystem', path: filePath });
                    });
                    writeStream.on('error', reject);
                });
            }

            await this.minioClient.putObject(
                this.bucketName,
                objectName,
                stream,
                size
            );

            console.log(`[STORAGE] Streamed ${taskId} to MinIO (${size} bytes)`);
            return {
                location: 'minio',
                bucket: this.bucketName,
                object: objectName,
                size
            };

        } catch (err) {
            console.error(`[STORAGE] Failed to stream ${taskId}:`, err.message);
            throw err;
        }
    }

    /**
     * Delete result (cleanup)
     * @param {string} taskId - Task identifier
     */
    async deleteResult(taskId) {
        const objectName = `results/${taskId}.bin`;

        try {
            if (this.useFilesystem) {
                const filePath = path.join(process.cwd(), 'storage', objectName);
                await fs.remove(filePath);
                console.log(`[STORAGE] Deleted ${taskId} from filesystem`);
                return;
            }

            await this.minioClient.removeObject(this.bucketName, objectName);
            console.log(`[STORAGE] Deleted ${taskId} from MinIO`);

        } catch (err) {
            console.error(`[STORAGE] Failed to delete ${taskId}:`, err.message);
        }
    }

    /**
     * Get storage stats
     */
    async getStats() {
        try {
            if (this.useFilesystem) {
                const storageDir = path.join(process.cwd(), 'storage', 'results');
                if (await fs.pathExists(storageDir)) {
                    const files = await fs.readdir(storageDir);
                    let totalSize = 0;

                    for (const file of files) {
                        const stats = await fs.stat(path.join(storageDir, file));
                        totalSize += stats.size;
                    }

                    return {
                        backend: 'filesystem',
                        objectCount: files.length,
                        totalSize,
                        totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2)
                    };
                }
                return { backend: 'filesystem', objectCount: 0, totalSize: 0 };
            }

            // MinIO stats
            const objects = [];
            const stream = this.minioClient.listObjectsV2(this.bucketName, 'results/', true);

            return new Promise((resolve, reject) => {
                let totalSize = 0;

                stream.on('data', obj => {
                    objects.push(obj);
                    totalSize += obj.size;
                });

                stream.on('end', () => {
                    resolve({
                        backend: 'minio',
                        objectCount: objects.length,
                        totalSize,
                        totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2)
                    });
                });

                stream.on('error', reject);
            });

        } catch (err) {
            console.error('[STORAGE] Failed to get stats:', err.message);
            return { error: err.message };
        }
    }
}

module.exports = new StorageService();
