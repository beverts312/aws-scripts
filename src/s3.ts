import AWS = require('aws-sdk');
import fs = require('fs');
import path = require('path');

class S3 {

    private s3: AWS.S3;

    /**
     * Creates an instance of S3.
     * @param {AWS.S3.ClientConfiguration} [opts]
     * @memberOf S3
     */
    constructor(opts?: AWS.S3.ClientConfiguration) {
        this.s3 = new AWS.S3(opts);

        /*AWS.config.update({
            credentials: {
                accessKeyId: 'AKIAI7S7D46V2J5MR6HQ',
                secretAccessKey: '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'
            }
        });*/
    }

    /**
     * 
     * @param {string} toUpload
     * @param {string} bucket
     * @param {string} acl
     * @param {string} [prefix]
     * @returns {Promise}
     * @memberOf S3
     */
    async uploadToS3(toUpload: string, bucket: string, acl: string, prefix?: string) {
        return new Promise((resolve, reject) => {
            fs.lstat(toUpload, (err, stats) => {
                if (err) { reject(err); }
                if (stats.isDirectory()) {
                    let pending = 0;
                    this.getFilesInDirectory(toUpload).then((files) => {
                        pending += files.length;
                        files.forEach((file) => {
                            let shortFile = file.substring(toUpload.length + 1);
                            if (prefix) {
                                shortFile = prefix + shortFile;
                            }
                            this.uploadFileToS3(file, bucket, acl, prefix, shortFile).then(() => {
                                if (!pending) {
                                    resolve();
                                } else {
                                    pending -= 1;
                                }
                            }).catch((err) => reject(err));
                        });
                    });
                } else {
                    this.uploadFileToS3(toUpload, bucket, acl, prefix)
                        .then(() => resolve())
                        .catch((err) => reject(err));
                }
            });
        });
    }

    private async uploadFileToS3(toUpload: string, bucket: string, acl: string, prefix?: string, key?: string) {
        return new Promise((resolve, reject) => {
            const params: AWS.S3.PutObjectRequest = {
                Bucket: bucket,
                ACL: acl,
                ContentType: this.getContentType(toUpload.split('.').pop()),
                Body: fs.createReadStream(toUpload),
                Key: key
            };
            if (!key) {
                params.Key = toUpload.split('/').pop();
            }
            if (prefix) {
                params.Key = prefix + params.Key;
            }
            this.s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Uploaded ' + key);
                    resolve();
                }
            });
        });
    }

    private getContentType(extension: string): string {
        switch (extension) {
            case 'html': return 'text/html';
            case 'css': return 'text/css';
            case 'js': return 'application/javascript';
            case 'ts': return 'application/typescript';
            case 'gif': return 'image/gif';
            case 'jpg': return 'image/jpeg';
            case 'png': return 'image/png';
            default: return 'application/octet-stream';
        }
    }

    private getFilesInDirectory(filePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let list = [];
            fs.readdir(filePath, (err, files) => {
                if (err) { reject(err); }
                let pending = files.length;
                if (!pending) { resolve(list); }
                files.forEach((file) => {
                    fs.lstat(path.join(filePath, file), (err, stats) => {
                        if (err) { reject(err); }
                        file = path.join(filePath, file);
                        if (stats.isDirectory()) {
                            this.getFilesInDirectory(file).then((files) => {
                                list = list.concat(files);
                                pending -= 1;
                                if (!pending) { resolve(list); }
                            }).catch((err) => reject(err));
                        } else {
                            list.push(file);
                            pending -= 1;
                            if (!pending) { resolve(list); }
                        }
                    });
                });
            });
        });
    }
}
export = S3;