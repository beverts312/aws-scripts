'use strict';

import Chai = require('chai');
import Sinon = require('sinon');
import AWS = require('aws-sdk');

import fs = require('fs');

import CloudFormation = require('../src/cloud-formation');

const assert = Chai.assert;

suite('CloudFormation Suite -', () => {
    let sut: CloudFormation;
    let listStub: Sinon.SinonStub;
    let sandbox: Sinon.SinonSandbox;

    const stacks = {
        StackSummaries: [
            {
                StackName: 'name',
                StackStatus: ''
            }
        ]
    };

    suite('checkIfStackExists Suite -', () => {

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = { listStacks: () => { } }; // tslint:disable-line
            listStub = sandbox.stub(t, 'listStacks');
            sandbox.stub(AWS, 'CloudFormation').returns(t);
            sut = new CloudFormation();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error response - ', (done: () => void) => {
            listStub.throws(new Error('test'));
            sut.checkIfStackExists('name').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Returns false if stack doesnt exist - ', (done: () => void) => {
            listStub.yields(null, stacks);
            sut.checkIfStackExists('test').then((res) => {
                assert.isFalse(res);
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Returns true if stack exists - ', (done: () => void) => {
            listStub.yields(null, stacks);
            sut.checkIfStackExists('name').then((res) => {
                assert.isTrue(res);
                assert.isTrue(listStub.called);
                done();
            });
        });
    });

    suite('createOrUpdateStackFile Suite -', () => {
        let createStub: Sinon.SinonStub;
        let updateStub: Sinon.SinonStub;
        let waitStub: Sinon.SinonStub;
        let readStub: Sinon.SinonStub;

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = {
                listStacks: () => { },  // tslint:disable-line
                waitFor: () => { },     // tslint:disable-line
                createStack: () => { }, // tslint:disable-line
                updateStack: () => { }  // tslint:disable-line
            };
            listStub = sandbox.stub(t, 'listStacks');
            createStub = sandbox.stub(t, 'createStack');
            updateStub = sandbox.stub(t, 'updateStack');
            waitStub = sandbox.stub(t, 'waitFor');
            readStub = sandbox.stub(fs, 'readFileSync');
            readStub.returns('{}');
            sandbox.stub(AWS, 'CloudFormation').returns(t);
            sut = new CloudFormation();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error response - ', (done: () => void) => {
            listStub.throws(new Error('test'));
            sut.createOrUpdateStackFile('name', 'path').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Calls create if stack doesnt exist - , handles create error', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.throws(new Error('testerr'));
            sut.createOrUpdateStackFile('test', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(createStub.called);
                done();
            });
        });

        test('Calls update if stack exists - , handles update error', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.throws(new Error('testerr'));
            sut.createOrUpdateStackFile('name', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                done();
            });
        });

        test('Calls create if doesnt stack exists - , handles wait error', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.yields(null, null);
            waitStub.throws(new Error('testerr'));
            sut.createOrUpdateStackFile('test', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls update if stack exists - , handles wait error', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.yields(null, null);
            waitStub.throws(new Error('testerr'));
            sut.createOrUpdateStackFile('name', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls create if doesnt stack exists, resolves on success', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.yields(null, null);
            waitStub.yields(null, null);
            sut.createOrUpdateStackFile('test', 'path').then(() => {
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls update if stack exists, resolves on success', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.yields(null, null);
            waitStub.yields(null, null);
            sut.createOrUpdateStackFile('name', 'path').then(() => {
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });
    });

    suite('createOrUpdateStackUrl Suite -', () => {
        let createStub: Sinon.SinonStub;
        let updateStub: Sinon.SinonStub;
        let waitStub: Sinon.SinonStub;

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = {
                listStacks: () => { },  // tslint:disable-line
                waitFor: () => { },     // tslint:disable-line
                createStack: () => { }, // tslint:disable-line
                updateStack: () => { }  // tslint:disable-line
            };
            listStub = sandbox.stub(t, 'listStacks');
            createStub = sandbox.stub(t, 'createStack');
            updateStub = sandbox.stub(t, 'updateStack');
            waitStub = sandbox.stub(t, 'waitFor');
            sandbox.stub(AWS, 'CloudFormation').returns(t);
            sut = new CloudFormation();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error response - ', (done: () => void) => {
            listStub.throws(new Error('test'));
            sut.createOrUpdateStackUrl('name', 'path').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Calls create if stack doesnt exist - , handles create error', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.throws(new Error('testerr'));
            sut.createOrUpdateStackUrl('test', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(createStub.called);
                done();
            });
        });

        test('Calls update if stack exists - , handles update error', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.throws(new Error('testerr'));
            sut.createOrUpdateStackUrl('name', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                done();
            });
        });

        test('Calls create if doesnt stack exists - , handles wait error', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.yields(null, null);
            waitStub.throws(new Error('testerr'));
            sut.createOrUpdateStackUrl('test', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls update if stack exists - , handles wait error', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.yields(null, null);
            waitStub.throws(new Error('testerr'));
            sut.createOrUpdateStackUrl('name', 'path').catch((err) => {
                assert.equal(err.message, 'testerr');
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls create if doesnt stack exists, resolves on success', (done: () => void) => {
            listStub.yields(null, stacks);
            createStub.yields(null, null);
            waitStub.yields(null, null);
            sut.createOrUpdateStackUrl('test', 'path').then(() => {
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });

        test('Calls update if stack exists, resolves on success', (done: () => void) => {
            listStub.yields(null, stacks);
            updateStub.yields(null, null);
            waitStub.yields(null, null);
            sut.createOrUpdateStackUrl('name', 'path').then(() => {
                assert.isTrue(listStub.called);
                assert.isTrue(updateStub.called);
                assert.isTrue(waitStub.called);
                done();
            });
        });
    });
});