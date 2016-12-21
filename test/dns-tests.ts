'use strict';

import Chai = require('chai');
import Sinon = require('sinon');
import AWS = require('aws-sdk');

import DnsUtils = require('../src/dns');

const assert = Chai.assert;

suite('Helper Suite -', () => {
    let sut: DnsUtils;

    suite('getHostedZoneId Suite -', () => {
        let sandbox: Sinon.SinonSandbox;
        let listStub: Sinon.SinonStub;

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = { listHostedZones: () => { } }; // tslint:disable-line
            listStub = Sinon.stub(t, 'listHostedZones');
            Sinon.stub(AWS, 'Route53').returns(t);
            sut = new DnsUtils();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error response - ', (done: () => void) => {
            listStub.throws(new Error());
            sut.getHostedZoneId('').catch((err) => {
                assert.isNotNull(err);
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Handles Missing Zone -', (done: () => void) => {
            const data: AWS.Route53.ListHostedZonesResponse = {
                HostedZones: [
                    {
                        Id: 'id',
                        Name: 'name',
                        CallerReference: ''
                    }
                ],
                Marker: '',
                IsTruncated: false,
                MaxItems: ''
            };
            listStub.yields(null, data);
            sut.getHostedZoneId('test').catch((err) => {
                assert.equal(err.message, 'Could Not Find Record for test');
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Retrieves Correct ID -', (done: () => void) => {
            const data: AWS.Route53.ListHostedZonesResponse = {
                HostedZones: [
                    {
                        Id: 'id',
                        Name: 'name',
                        CallerReference: ''
                    }
                ],
                Marker: '',
                IsTruncated: false,
                MaxItems: ''
            };
            listStub.yields(null, data);
            sut.getHostedZoneId('name').then((id) => {
                assert.equal(id, 'id');
                assert.isTrue(listStub.called);
                done();
            });
        });
    });
});