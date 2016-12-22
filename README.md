# Node AWS Utils  
Wrapper methods & scripbadgets for easy use of the AWS SDK.  
The aws-sdk is great in terms of completeness, but it typically takes a chain of a few methods to complete most simple tasks, this library aims to make it a little easier to perform specific tasks.  

I will add more features as I need them for other projects.  
Feel free to request new features with an issue or to submit new features with a PR. 

![](https://beverts.visualstudio.com/_apis/public/build/definitions/93e3d145-8350-4675-b220-333870597580/115/badge)  

## Usage
Configure using the aws-sdk [instructions](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html).  

Install: `npm install --save aws-mgmt-utils`  
Import: `import utils = require('aws-mgmt-utils');`  

### CloudFormation
Initialize the class: `const cloudFormation = new utils.CloudFormation(opts);`, it takes these [options](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#constructor-property), this params is optional.  

* `createOrUpdateStackUrl(name: string, templateUrl: string): Promise` - This method can be used to create or update a stack using a template hosted in S3. Waits for create/update to complete.  
* `createOrUpdateStackFile(name: string, templatePath: string): Promise` - This method can be used to create or update a stack using a local template. Waits for create/update to complete.  
* `checkIfStackExists(name: string): Promise<boolean>` - This method can be used to determine whether or not a stack exists.  

### Route53
Initialize the class: `const route53 = new utils.Route53(opts);`, it takes these [options](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#constructor-property), this params is optional.  

* `getHostedZoneId(name: string): Promise<string>` - This method can be used to retrieve a hosted zone ID  
* `updateRecord(name: string, type: string, value: string): Promise` - This method can be used to update a DNS record  

### S3
Initialize the class: `s3 = new utils.S3(opts);`, it takes these [options](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property), this params is optional.  

* `uploadToS3(toUpload: string, bucket: string, acl: string, prefix?: string): Promise` - Uploads a file or folder to S3  

## Example Scripts  
|Script|Description|
|------|-----------|
|[update-record.ts](./scripts/update-record.ts)|This script can be used to easily update Route53 DNS records|
|[upload-dir.ts](./script/update-dir.ts)|This script can be used to upload a file or folder to S3|

## Developing  
This library is written using [typescript](http://www.typescriptlang.org/).  
All core developer functions are npm scripts:  
* `npm install` - Get typings and packages  
* `npm run build` - Transpile  
* `npm run test` - Run unit tests  
* `npm run clean` - Remove transpiled javascript  

The files in the [.vscode directory](./.vscode) configure the [VS Code Editor](https://code.visualstudio.com) for use with this project.  
If you use VS Code I would reccomend the [Status Bar Tasks](https://marketplace.visualstudio.com/items?itemName=GuardRex.status-bar-tasks) extension, this will make all of those core deceloper tasks (and more) buttons on the bottom of your editor.  

#### Generator  
Initially created by this [swell generator](https://github.com/swellaby/generator-swell)  
