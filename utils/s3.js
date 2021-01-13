const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

class S3 {
    constructor(region, bucket) {
        this.bucket = bucket;
        this.region = region;

        this.s3 = new S3Client({region: process.env.AWS_REGION});
    }

    async fileExists(key) {
        try {
            const checkFile = await this.s3.send(new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            }));

            if (checkFile.hasOwnProperty('LastModified')) {
                return true;
            }
        } catch (e) {
            if (e["$metadata"]["httpStatusCode"] == 403 && e["$fault"] == 'client') {
                return false;
            } else {
                throw Error(e);
            }
        }
    }

    async upload(key, body) {
        return await this.s3.send(new PutObjectCommand({
            Bucket: process.env.SCRAPER_BUCKET,
            Key: key,
            Body: body
        }));
    }
}

module.exports = S3;
