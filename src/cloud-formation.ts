import AWS = require('aws-sdk');
import fs = require('fs');

class CloudFormation {
    private cloudformation: AWS.CloudFormation;

    /**
     * Creates an instance of CloudFormationUtils.
     * @param {AWS.CloudFormation.ClientConfiguration} [opts]
     * @memberOf CloudFormationUtils
     */
    constructor(opts?: AWS.CloudFormation.ClientConfiguration) {
        this.cloudformation = new AWS.CloudFormation(opts);
    }

    /**
     * Creates/Updates a stack using a local template
     * @param {string} name
     * @param {string} templatePath
     * @returns {Promise<string>}
     * 
     * @memberOf CloudFormationUtils
     */
    createOrUpdateStackFile(name: string, templatePath: string): Promise<string> {
        const params = {
            StackName: name,
            TemplateBody: fs.readFileSync(templatePath, 'utf8'),
            Capabilities: ['CAPABILITY_IAM']
        };
        return new Promise<string>((resolve, reject) => {
            this.checkIfStackExists(params.StackName).then((exists) => {
                if (exists === true) {
                    console.log('Stack exists, updating existing stack');
                    this.updateStackWithWait(params).then(() => resolve('success'))
                        .catch((err) => reject(err));
                } else {
                    console.log('Stack does not exist, creating new stack');
                    this.createStackWithWait(params).then(() => resolve('success'))
                        .catch((err) => reject(err));
                }
            }).catch((err) => reject(err));
        });
    }

    /**
     * Creates/Updates a stack using a template hosted in S3
     * @param {string} name
     * @param {string} templateUrl
     * @returns {Promise<string>}
     * @memberOf CloudFormationUtils
     */
    createOrUpdateStackUrl(name: string, templateUrl: string): Promise<string> {
        const params = {
            StackName: name,
            TemplateURL: templateUrl,
            Capabilities: ['CAPABILITY_IAM']
        };
        return new Promise<string>((resolve, reject) => {
            this.checkIfStackExists(params.StackName).then((exists) => {
                if (exists === true) {
                    console.log('Stack exists, updating existing stack');
                    this.updateStackWithWait(params).then(() => resolve('success'))
                        .catch((err) => reject(err));
                } else {
                    console.log('Stack does not exist, creating new stack');
                    this.createStackWithWait(params).then(() => resolve('success'))
                        .catch((err) => reject(err));
                }
            }).catch((err) => reject(err));
        });
    }

    /**
     * Checks to see if a stack exists
     * @param {string} name
     * @returns {Promise<boolean>}
     * @memberOf CloudFormationUtils
     */
    checkIfStackExists(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.cloudformation.listStacks(null, (err, data) => {
                if (err) {
                    reject(err);
                }
                const stacks = data.StackSummaries;
                for (let i = 0; i < stacks.length; i++) {
                    if (stacks[i].StackName === name && stacks[i].StackStatus !== 'DELETE_COMPLETE') {
                        resolve(true);
                    }
                }
                resolve(false);
            });
        });

    }

    /**
     * Creates a Stack and waits for completion of the operation
     * @param {AWS.CloudFormation.CreateStackInput} params
     * @returns {Promise<boolean>}
     * @memberOf CloudFormationUtils
     */
    createStackWithWait(params: AWS.CloudFormation.CreateStackInput): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.cloudformation.createStack(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Create operation successful, waiting for resources');
                    this.cloudformation.waitFor('stackCreateComplete', { StackName: params.StackName }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    /**
     * Updates a Stack and waits for completion of the update
     * @param {AWS.CloudFormation.UpdateStackInput} params
     * @returns {Promise<boolean>}
     * @memberOf CloudFormationUtils
     */
    updateStackWithWait(params: AWS.CloudFormation.UpdateStackInput): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.cloudformation.updateStack(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Update operation successful, waiting for resources');
                    this.cloudformation.waitFor('stackUpdateComplete', { StackName: params.StackName }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
}

export = CloudFormation;