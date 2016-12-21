'use strict';

import Chai = require('chai');
import Sinon = require('sinon');
import AWS = require('aws-sdk');

import Route53 = require('../src/route53');

const assert = Chai.assert;

suite('route53 Suite -', () => {
    let sut: Route53;
    let listStub: Sinon.SinonStub;
    let sandbox: Sinon.SinonSandbox;

    suite('getHostedZoneId Suite -', () => {

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = { listHostedZones: () => { } }; // tslint:disable-line
            listStub = Sinon.stub(t, 'listHostedZones');
            sandbox.stub(AWS, 'Route53').returns(t);
            sut = new Route53();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error response - ', (done: () => void) => {
            listStub.throws(new Error('test'));
            sut.getHostedZoneId('').catch((err) => {
                assert.equal(err.message, 'test');
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

    suite('updateRecord Suite -', () => {
        let changeRecordStub: Sinon.SinonStub;

        suiteSetup(() => {
            sandbox = Sinon.sandbox.create();
            const t = {
                listHostedZones: () => { },         // tslint:disable-line
                changeResourceRecordSets: () => { } // tslint:disable-line
            };
            listStub = Sinon.stub(t, 'listHostedZones');
            changeRecordStub = Sinon.stub(t, 'changeResourceRecordSets');
            sandbox.stub(AWS, 'Route53').returns(t);
            sut = new Route53();
        });

        suiteTeardown(() => {
            sandbox.restore();
        });

        test('Handles error from getHostedZoneId - ', (done: () => void) => {
            listStub.throws(new Error('test'));
            sut.updateRecord('', '', '').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(listStub.called);
                done();
            });
        });

        test('Handles upsert error -', (done: () => void) => {
            const data: AWS.Route53.ListHostedZonesResponse = {
                HostedZones: [
                    {
                        Id: 'id',
                        Name: 'name.com.',
                        CallerReference: ''
                    }
                ],
                Marker: '',
                IsTruncated: false,
                MaxItems: ''
            };
            listStub.yields(null, data);
            changeRecordStub.throws(new Error('test'));
            sut.updateRecord('name.com', 'TXT', 'test').catch((err) => {
                assert.equal(err.message, 'test');
                assert.isTrue(listStub.called);
                assert.isTrue(changeRecordStub.called);
                done();
            });
        });


        test('Resolves when success -', (done: () => void) => {
            const data: AWS.Route53.ListHostedZonesResponse = {
                HostedZones: [
                    {
                        Id: 'id',
                        Name: 'name.com.',
                        CallerReference: ''
                    }
                ],
                Marker: '',
                IsTruncated: false,
                MaxItems: ''
            };
            listStub.yields(null, data);
            changeRecordStub.yields(null, null);
            sut.updateRecord('name.com', 'A', '10.10.10.10').then(() => {
                assert.isTrue(changeRecordStub.called);
                assert.isTrue(listStub.called);
                done();
            });
        });
    });
});