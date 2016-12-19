import AWS = require('aws-sdk');

class DnsUtils {
    dns: AWS.Route53;

    constructor(opts?: AWS.Route53.ClientConfiguration) {
        this.dns = new AWS.Route53(opts);
    }

    getHostedZoneId(name: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.dns.listHostedZones((err, data) => {
                if (err) {
                    reject(err);
                }
                const zones = data.HostedZones;
                for (let i = 0; i < zones.length; i++) {
                    if (zones[i].Name === name) {
                        resolve(zones[i].Id);
                    }
                }
                reject(new Error('Could Not Find Record for ' + name));
            });
        });
    }

    async updateRecord(name: string, type: string, value: string) {
        const nameArr = name.split('.');
        const zoneName = nameArr[nameArr.length - 2] + '.' + nameArr[nameArr.length - 1] + '.';
        if (type === 'TXT') {
            value = '"' + value + '"';
        }
        const params: AWS.Route53.ChangeResourceRecordSetsRequest = {
            HostedZoneId: null,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: {
                            Name: name,
                            Type: type,
                            TTL: 300,
                            ResourceRecords: [
                                {
                                    Value: value
                                }
                            ]
                        }
                    }]
            }
        };
        return new Promise((resolve, reject) => {
            this.getHostedZoneId(zoneName).then((id) => {
                params.HostedZoneId = id;
                this.dns.changeResourceRecordSets(params, (err, data) => {
                    if (err) {
                        reject(err.message);
                    }
                    resolve();
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export = DnsUtils;