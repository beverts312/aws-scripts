import DnsUtils = require('../src/dns-utils');

function usage() {
    console.log('Usage: node update-record <record to update> <record type> <value>');
    console.log('Example: node update-record sub.example.com A 98.101.23.99');
    console.log('Assumes the AWS CLI is configured on your machine');
}

if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    usage();
    process.exit(1);
}

const record = process.argv[2];
const type = process.argv[3];
const value = process.argv[4];

const dns = new DnsUtils();

dns.updateRecord(record, type, value).then(() => {
    console.log('Success');
}).catch((err) => {
    console.error(err);
    process.exit(1);
});