import S3 = require('../src/s3');


function usage() {
    console.log('Usage: node upload-dir <dir/file to upload> <acl> <bucket> <prefix>');
    console.log('Example: node update-record /home/user/test public-read mybucket prefix');
    console.log('Assumes the AWS CLI is configured on your machine');
}

if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    usage();
    process.exit(1);
}

const dir = process.argv[2];
const acl = process.argv[3];
const bucket = process.argv[4];
const prefix = process.argv[5];


const s3 = new S3();

s3.uploadToS3(dir, bucket, acl, prefix).then(() => {
    console.log('Success');
}).catch((err) => {
    console.log(JSON.stringify(err));
    process.exit(1);
});