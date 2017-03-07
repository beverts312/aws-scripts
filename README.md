# Node AWS Utils  
Wrapper methods & scripts for easy use of the AWS SDK.  
The aws-sdk is great in terms of completeness, but it typically takes a chain of a few methods to complete most simple tasks, this library aims to make it a little easier to perform specific tasks.  

I will add more features as I need them for other projects.  
Feel free to request new features with an issue or to submit new features with a PR.  
![][build-badge] ![npm][dl-badge] ![npm][version-badge]  

## Usage
Configure using the aws-sdk [instructions][aws-config-url].  

Install: `npm install --save aws-mgmt-utils`  
Import: `import utils = require('aws-mgmt-utils');`  

### CloudFormation
Initialize the class: `const cloudFormation = new utils.CloudFormation(opts);`, it takes these [options][cf-opts], this param is optional.  

* `createOrUpdateStackUrl(name: string, templateUrl: string): Promise` - This method can be used to create or update a stack using a template hosted in S3. Waits for create/update to complete.  
* `createOrUpdateStackFile(name: string, templatePath: string): Promise` - This method can be used to create or update a stack using a local template. Waits for create/update to complete.  
* `checkIfStackExists(name: string): Promise<boolean>` - This method can be used to determine whether or not a stack exists.  

### Route53
Initialize the class: `const route53 = new utils.Route53(opts);`, it takes these [options][r53-opts], this param is optional.  

* `getHostedZoneId(name: string): Promise<string>` - This method can be used to retrieve a hosted zone ID  
* `updateRecord(name: string, type: string, value: string): Promise` - This method can be used to update a DNS record  

### S3
Initialize the class: `const s3 = new utils.S3(opts);`, it takes these [options][s3-opts], this param is optional.  

* `uploadToS3(toUpload: string, bucket: string, acl: string, prefix?: string): Promise` - Uploads a file or folder to S3  

## Example Scripts  
|Script|Description|
|------|-----------|
|[update-record.ts][update-record-ts]|This script can be used to easily update Route53 DNS records|
|[route53-on-o365.ts][route53-on-o365-ts]|This script can be used to configure a Route53 hosted zone with O365|
|[upload-dir.ts][upload-dir-ts]|This script can be used to upload a file or folder to S3|

## CLI  
The example scripts are configured to be accessable if you install this package globally (`npm install -g aws-mgmt-utils`).  
The available executables are (type them into the command line to see usage):  

- r53-update-record: Maps to [update-record.ts][update-record-ts]
- s3-upload-dir: Maps to [upload-dir.ts][upload-dir-ts]
- r53-o365: Maps to [route53-on-o365.ts][route53-on-o365-ts]

## Developing  
This library is written using [typescript][typecript-url].  
All core developer functions are npm scripts:  
* `npm install` - Get typings and packages  
* `npm run build` - Transpile  
* `npm run test` - Run unit tests  
* `npm run clean` - Remove transpiled javascript  

The files in the [.vscode directory][vscode-dir] configure the [VS Code Editor][vscode-url] for use with this project.  
If you use VS Code I would reccomend the [Status Bar Tasks][status-bar-tasks-url] extension, this will make all of those core developer tasks (and more) buttons on the bottom of your editor.  

#### Generator  
Initially created by this [swell generator](https://github.com/swellaby/generator-swell)  

[typecript-url]: http://www.typescriptlang.org/
[vscode-url]: https://code.visualstudio.com
[vscode-dir]: ./.vscode
[status-bar-tasks-url]: https://marketplace.visualstudio.com/items?itemName=GuardRex.status-bar-tasks
[update-record-ts]: ./scripts/update-record.ts
[route53-on-o365-ts]: ./scripts/route53-on-o365.ts
[upload-dir-ts]: ./scripts/upload-dir.ts
[s3-opts]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
[r53-opts]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#constructor-property
[cf-opts]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#constructor-
[build-badge]: https://ahool.visualstudio.com/_apis/public/build/definitions/4b152283-84d0-4972-b9a0-8c722bc44fae/1/badge
[dl-badge]: https://img.shields.io/npm/v/aws-mgmt-utils.svg
[version-badge]: https://img.shields.io/npm/dt/aws-mgmt-utils.svg
[aws-config-url]: http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html