'use strict';

import Chai = require('chai');
import Sinon = require('sinon');

import AWS = require('aws-sdk');
import fs = require('fs');

import S3 = require('../src/s3');

const assert = Chai.assert;

suite('S3 Suite -', () => {
    let sut: S3;
    let uploadStub: Sinon.SinonStub;
    let lstatStub: Sinon.SinonStub;
    let readStreamStub: Sinon.SinonStub;
    let readDirStub: Sinon.SinonStub;
    let sandbox: Sinon.SinonSandbox;

    suite('uploadToS3 Suite -', () => {

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = { upload: () => { } }; // tslint:disable-line
            uploadStub = sandbox.stub(t, 'upload');
            lstatStub = sandbox.stub(fs, 'lstat');
            readDirStub = sandbox.stub(fs, 'readdir');
            readStreamStub = sandbox.stub(fs, 'createReadStream');
            sandbox.stub(AWS, 'S3').returns(t);
            sut = new S3();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error when retrieving dir info - ', (done: () => void) => {
            lstatStub.withArgs('asd').throws(new Error('test'));
            sut.uploadToS3('asd', 'bucket', 'acl', 'prefix').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(lstatStub.called);
                done();
            });
        });

        test('Handles error when uploading single file - ', (done: () => void) => {
            lstatStub.yields(null, { isDirectory: () => { return false; } });
            uploadStub.throws(new Error('test'));
            sut.uploadToS3('dir', 'bucket', 'acl', 'prefix').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(uploadStub.called);
                assert.isTrue(lstatStub.called);
                assert.isTrue(readStreamStub.called);
                done();
            });
        });

        test('Handles error when uploading multiple files - ', (done: () => void) => {
            lstatStub.withArgs('dir').yields(null, { isDirectory: () => { return true; } });
            lstatStub.withArgs('dir/adir').yields(null, { isDirectory: () => { return true; } });
            lstatStub.yields(null, { isDirectory: () => { return false; } });
            readDirStub.withArgs('dir').yields(null, ['adir', '1.html', '2.css', '3.js']);
            readDirStub.withArgs('dir/adir').yields(null, ['4.ts', '5.gif', '6.jpg', '7.png', '9']);
            readDirStub.yields(null, null);
            uploadStub.onCall(8).throws(new Error('test'));
            uploadStub.yields(null, null);
            sut.uploadToS3('dir', 'bucket', 'acl', 'prefix').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(uploadStub.called);
                assert.isTrue(lstatStub.called);
                done();
            });
        });

        test('Resolves on success of uploading multiple files - ', (done: () => void) => {
            lstatStub.withArgs('dir').yields(null, { isDirectory: () => { return true; } });
            lstatStub.yields(null, { isDirectory: () => { return false; } });
            readDirStub.withArgs('dir').yields(null, ['1.html', '2.css', '3.js']);
            uploadStub.yields(null, null);
            sut.uploadToS3('dir', 'bucket', 'acl').then(() => {
                assert.isTrue(uploadStub.called);
                assert.isTrue(lstatStub.called);
                assert.isTrue(readDirStub.called);
                done();
            });
        });
    });
});