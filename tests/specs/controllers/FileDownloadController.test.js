const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const stream = require('stream');
const FileDownloadController = require('../../../api/controllers/FileDownloadController');
const OrbitService = require('../../../api/services/OrbitService');
const Application = require('../../../api/models/index').Application;
const HelperService = require('../../../api/services/HelperService');

describe('FileDownloadController', () => {
  const sandbox = sinon.createSandbox();
  let reqStub;
  let resStub;

  beforeEach(() => {
    reqStub = {
      params: {
        apostilleRef: 'APO-1234',
        unique_app_id: 'A-D-21-1008-0547-D546',
        storageLocation: 'encodedStorageLocation',
      },
      _sails: {
        config: {
          upload: {
            orbit_bucket: 'test-bucket',
            orbit_url_expiry_hours: 1,
          },
        },
      },
      session: {
        user: {
          id: 123,
        },
      },
    };
    resStub = {
      serverError: sandbox.stub(),
      headers: {
        'content-disposition': '',
      },
      pipe: sandbox.stub(),
    };
    sandbox.stub(Date, 'now').callsFake(() => 1483228800000);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('throws if user is not logged in', () => {
    // when
    sandbox
      .stub(HelperService, 'getUserData')
      .callsFake(() => ({ loggedIn: false }));
    const fn = () =>
      FileDownloadController._urlErrorChecks(
        reqStub, resStub
      );

    // then
    expect(fn).to.throw(Error, 'User is not logged in');
  });

  it('throws if unique_app_id is not found', () => {
    // when
    reqStub.params.unique_app_id = null;
    sandbox
      .stub(HelperService, 'getUserData')
      .callsFake(() => ({ loggedIn: true }));
    const fn = () =>
      FileDownloadController._urlErrorChecks(
        reqStub, resStub
      );

    // then
    expect(fn).to.throw(Error, 'Application ID not found');
  });

  it('returns false if id from application table does not match user session id', async () => {
    // when
    sandbox.stub(Application, 'findOne').resolves({ user_id: 456 });
    await FileDownloadController._checkSessionUserIdMatchesApp(
      reqStub,
      resStub
    );

    // then
    expect(resStub.serverError.calledOnce).to.be.true;
  });

  it('throws an error if the apostilleRef param is undefined', () => {
    // when
    reqStub.params.apostilleRef = 'undefined';
    const fn = () =>
      FileDownloadController._urlErrorChecks(
        reqStub, resStub
      );

    // then
    expect(fn).to.throw(Error, 'Missing apostille reference');
  });

  it('throws an error if the storageLocation param is undefined', () => {
    // when
    reqStub.params.storageLocation = 'undefined';
    const fn = () =>
      FileDownloadController._urlErrorChecks(
        reqStub, resStub
      );

    // then
    expect(fn).to.throw(Error, 'Missing document storage location');
  });

  describe('_apostilleRefBelongToApplication', () => {
    beforeEach(() => {
      sandbox
        .stub(HelperService, 'getUserData')
        .callsFake(() => ({ loggedIn: true }));
    });

    it('sends the correct argument to OrbitService', () => {
      // when
      const getApplicationStub = sandbox
        .stub(OrbitService, 'getApplicationStatusFromOrbit')
        .resolves([{
          documents: [],
        }]);

      FileDownloadController._apostilleRefBelongToApplication(
        reqStub,
        resStub
      );

      // then
      expect(getApplicationStub.getCall(0).args[0]).to.eql(
        [reqStub.params.unique_app_id]
      );
    });

    it('returns true if application ref match found from OrbitService', async () => {
      // when
      sandbox.stub(OrbitService, 'getApplicationStatusFromOrbit').resolves([{
        documents: [
          { apostilleReference: 'APO-23456' },
          { apostilleReference: 'APO-1234' },
        ],
      }]);
      const res = await FileDownloadController._apostilleRefBelongToApplication(
        reqStub,
        resStub
      );

      // then
      expect(res).to.be.true;
    });

    it('returns false if application ref NOT found in OrbitService', async () => {
      // when
      sandbox.stub(OrbitService, 'getApplicationStatusFromOrbit').resolves([{
        documents: [
          { apostilleReference: 'APO-23456' },
        ],
      }]);
      const res = await FileDownloadController._apostilleRefBelongToApplication(
        reqStub,
        resStub
      );

      // then
      expect(res).to.be.false;
    });
  });

  describe('_streamOrbitFileToClient', () => {
    beforeEach(() => {
      sandbox
        .stub(HelperService, 'getUserData')
        .callsFake(() => ({ loggedIn: true }));
    });

    it('throws an error if the URL generation fails', async () => {
      // when
      sandbox.stub(FileDownloadController, '_generateOrbitApostilleUrl').rejects(new Error('URL generation failed'));

      try {
        await FileDownloadController._streamOrbitFileToClient(reqStub, resStub);
      } catch (err) {
        // then
        expect(err.message).to.equal('_streamOrbitFileToClient Error: Error: URL generation failed');
      }
    });

    it('handles streaming errors gracefully', async () => {
      // when
      sandbox.stub(FileDownloadController, '_generateOrbitApostilleUrl').resolves('http://fakeurl.com');
      sandbox.stub(axios, 'request').rejects(new Error('Streaming failed'));

      try {
        await FileDownloadController._streamOrbitFileToClient(reqStub, resStub);
      } catch (err) {
        // then
        expect(err.message).to.include('Streaming failed');
      }
    });
  });

  describe('_generateOrbitApostilleUrl', () => {
    it('generates a pre-signed URL for the file', async () => {
      // given
      const config = {
        s3Bucket: 'test-bucket',
        s3UrlExpiryHours: 1,
      };
      const urlStub = sandbox.stub().resolves('http://fake-signed-url.com');
      sandbox.stub(FileDownloadController, '_generateOrbitApostilleUrl').callsFake(urlStub);

      // when
      const url = await FileDownloadController._generateOrbitApostilleUrl('APO-1234', config, 'test-key');

      // then
      expect(url).to.equal('http://fake-signed-url.com');
      expect(urlStub.calledOnce).to.be.true;
    });

    it('throws an error if the URL generation fails', async () => {
      // given
      const config = {
        s3Bucket: 'test-bucket',
        s3UrlExpiryHours: 1,
      };
      const urlStub = sandbox.stub().rejects(new Error('URL generation failed'));
      sandbox.stub(FileDownloadController, '_generateOrbitApostilleUrl').callsFake(urlStub);

      try {
        // when
        await FileDownloadController._generateOrbitApostilleUrl('APO-1234', config, 'test-key');
      } catch (err) {
        // then
        expect(err.message).to.equal('URL generation failed');
      }
    });
  });
});
