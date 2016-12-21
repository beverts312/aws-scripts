'use strict';

import Chai = require('chai');

import sut = require('../src/index');

const assert = Chai.assert;

suite('Index Suite -', () => {
    test('Loads CloudFormation', (done: () => void) => {
        assert.isNotNull(new sut.CloudFormation());
        done();
    });

    test('Loads Route53', (done: () => void) => {
        assert.isNotNull(new sut.Route53());
        done();
    });

    test('Loads S3', (done: () => void) => {
        assert.isNotNull(new sut.S3());
        done();
    });
});