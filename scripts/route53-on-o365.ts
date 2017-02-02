import utils = require('../src/index');

function usage() {
    console.log('Usage: node route53-on-o365 <domain>');
    console.log('Assumes the AWS CLI is configured on your machine');
    console.log('Assumes you have already started adding your domain on o365 and completed the verification step');
}

if (!process.argv[2]) {
    usage();
    process.exit(1);
}

const domain = process.argv[2];
const domainArr = domain.split('.');

const records = [
    [domain, '0 ' + domainArr[0] + '-' + domainArr[1] + '.mail.protection.outlook.com', 'MX'],
    [domain, 'v=spf1 include:spf.protection.outlook.com -all', 'TXT'],
    ['autodiscover.' + domain, 'autodiscover.outlook.com', 'CNAME'],
    ['enterpriseenrollment.' + domain, 'enterpriseenrollment.manage.microsoft.com', 'CNAME'],
    ['enterpriseregistration.' + domain, 'enterpriseregistration.windows.net', 'CNAME'],
    ['lyncdiscover.' + domain, 'webdir.online.lync.com', 'CNAME'],
    ['msoid.' + domain, 'clientconfig.microsoftonline-p.net', 'CNAME'],
    ['sip.' + domain, 'sipdir.online.lync.com', 'CNAME'],
    ['_sip._tls.' + domain, '100 1 443 sipdir.online.lync.com', 'SRV'],
    ['_sipfederationtls._tcp.' + domain, '100 1 5061 sipfed.online.lync.com', 'SRV']
];

const dns = new utils.Route53();

for (let i = 0; i < records.length; i++) {
    console.log('Creating %s %s %s', records[i][0], records[i][2], records[i][1]);
    dns.updateRecord(records[i][0], records[i][2], records[i][1]).then(() => {
        console.log('Success');
    }).catch((err) => {
        console.error(err);
    });
}