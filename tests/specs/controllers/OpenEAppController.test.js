const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const stream = require('stream');
const util = require('util');
const OpenEAppController = require('../../../api/controllers/OpenEAppController');
const OrbitService = require('../../../api/services/OrbitService');
const Application = require('../../../api/models/index').Application;
const ExportedEAppData = require('../../../api/models/index').ExportedEAppData;
const HelperService = require('../../../api/services/HelperService');

describe('OpenEAppController', () => {
  const sandbox = sinon.createSandbox();
  let reqStub;
  let resStub;
  const resolvedAppData = {
    unique_app_id: 'id_from_apps_table',
    createdAt: '2021-08-19',
    user_id: 123,
  };
  const resolvedOrbitData = [{
    applicationReference: 'A-D-21-0809-2034-C968',
    status: 'In progress',
    completedDate: '2021-08-19 00:00',
    payment: {
      netAmount: 30.0,
      transactions: [
        {
          amount: 30.0,
          method: 'Credit/Debit Card',
          reference: '8516285240123586',
          transactionAmount: 30.0,
          transactionDate: '',
          type: 'Initial Incoming',
        },
      ],
    },
    documents: [
      {
        name: 'client_document_1.pdf',
        status: 'Submitted',
        apostilleReference: '',
        downloadExpired: false,
      },
    ],
  }];

  const expectedPageData = {
    applicationId: 'id_from_apps_table',
    dateSubmitted: '19 August 2021',
    dateCompleted: "19 August 2021",
    documents: [
      {
        name: 'client_document_1.pdf',
        status: 'Submitted',
        apostilleReference: '',
        downloadExpired: false,
      },
    ],
    originalCost: '£30.00',
    paymentRef: '8516285240123586',
  };
  const TWO_DAYS_AFTER_COMPLETION = 1629417600000;
  const TWELVE_DAYS_AFTER_COMPLETION = 1630281600000;

  beforeEach(() => {
    reqStub = {
      params: {
        unique_app_id: 'test_unique_app_id',
        storageLocation: 'encodedStorageLocation',
        applicationRef: 'test_application_ref',
      },
      protocol: 'http',
      headers: {
        host: 'localhost',
      },
      _sails: {
        config: {
          customURLs: {
            userServiceURL: 'localhost/3000'
          },
          upload: {
            max_days_to_download: '21',
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
      forbidden: sandbox.stub(),
      redirect: sandbox.stub(),
      view: sandbox.stub(),
    };
    sandbox.spy(sails.log, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should redirect to sign in page if user is not logged in', async () => {
    // when
    sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
      loggedIn: false,
    }));
    await OpenEAppController.renderPage(reqStub, resStub);

    // then
    expect(resStub.redirect.firstCall.args[0]).to.equal('localhost/3000/sign-in?eappid=test_unique_app_id');
  });

  it('prevents viewing the page if application ref is undefined', async () => {
    // when
    sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
      loggedIn: true,
    }));
    reqStub.params.unique_app_id = 'undefined';
    await OpenEAppController.renderPage(reqStub, resStub);

    // then
    expect(resStub.view.called).to.be.true;
  });

  it("prevents the user from viewing someone else's application", async () => {
    // when
    sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
      loggedIn: true,
    }));
    sandbox.stub(Application, 'findOne').resolves({ user_id: 456 });
    await OpenEAppController.renderPage(reqStub, resStub);

    // then
    expect(resStub.forbidden.called).to.be.true;
  });

  describe('happy path', () => {
    let findApplicationData;

    beforeEach(() => {
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: true,
      }));
      sandbox
        .stub(Date, 'now')
        .callsFake(() => TWO_DAYS_AFTER_COMPLETION);
      findApplicationData = sandbox
        .stub(Application, 'findOne')
        .resolves(resolvedAppData);
      sandbox
        .stub(OpenEAppController, '_getApplicationDataFromOrbit')
        .resolves(resolvedOrbitData);
      sandbox.stub(OpenEAppController, '_getUserRef').resolves('123456');
    });

    it('should get data from the Application table', async () => {
      // when - beforeEach runs
      await OpenEAppController.renderPage(reqStub, resStub);
      // then
      expect(
        findApplicationData.calledWith({
          where: { unique_app_id: 'test_unique_app_id' },
        })
      ).to.be.true;
    });

    it('should render openEApp.ejs page with correct data', async () => {
      // when - beforeEach runs
      await OpenEAppController.renderPage(reqStub, resStub);
      // then
      expect(resStub.view.getCall(0).args[1]).to.deep.equal({
        ...expectedPageData,
        userRef: '123456',
        user_data: { loggedIn: true },
        daysLeftToDownload: 0,
        applicationExpired: false,
        applicationStatus: resolvedOrbitData[0].status,
        allDocumentsRejected: false,
        someDocumentsRejected: false,
        caseManagementReceiptLocation: undefined
      });
    });
  });

  describe('date countdown', () => {
    it('shows correct number of days for 11 day old application', async () => {
      // when
      sandbox.stub(Application, 'findOne').resolves(resolvedAppData);
      resolvedOrbitData[0].status = 'Completed';
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: true,
      }));
      sandbox
        .stub(OpenEAppController, '_getApplicationDataFromOrbit')
        .resolves(resolvedOrbitData);
      sandbox.stub(OpenEAppController, '_getUserRef').resolves('');
      sandbox
        .stub(Date, 'now')
        .callsFake(() => TWELVE_DAYS_AFTER_COMPLETION);
      await OpenEAppController.renderPage(reqStub, resStub);

      // then
      expect(resStub.view.getCall(0).args[1].daysLeftToDownload).to.equal(10);
    });
  });

  describe('_calculateDaysLeftToDownload', () => {
    it('throws error if no date value found', () => {
      // when
      const fn = () =>
        OpenEAppController._calculateDaysLeftToDownload(
          {
            completedDate: null,
          },
          reqStub
        );

      // then
      expect(fn).to.throw(Error, 'No date value found');
    });

    it('returns expected values', () => {
      // when
      const SEVEN_DAYS_AFTER_COMPLETION = 1629849600000;
      const TWENTY_ONE_DAYS_AFTER_COMPLETION = 1631142000000;

      const currentDates = [
        TWELVE_DAYS_AFTER_COMPLETION,
        SEVEN_DAYS_AFTER_COMPLETION,
        TWO_DAYS_AFTER_COMPLETION,
        TWENTY_ONE_DAYS_AFTER_COMPLETION,
      ];
      const expectedValues = [10, 15, 20, 0];
      const returnedValues = currentDates.map((currentDate) => {
        sandbox.stub(Date, 'now').callsFake(() => currentDate);
        const result = OpenEAppController._calculateDaysLeftToDownload(
          resolvedOrbitData[0],
          reqStub
        );
        Date.now.restore();
        return result;
      });

      // then
      expect(expectedValues).to.deep.equal(returnedValues);
    });
  });

  describe('downloadDocument', () => {
    it('throws if there are no documents found', () => {
      // when
      resolvedOrbitData[0].documents = null;
      const fn = () =>
        OpenEAppController._hasApplicationExpired(
          resolvedOrbitData[0],
          21
        );

      // then
      expect(fn).to.throw();
    });

    it('returns true if total documents matches expired documents', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
      ];
      const result = OpenEAppController._hasApplicationExpired(
        resolvedOrbitData[0],
        0
      );

      // then
      expect(result).to.be.true;
    });

    it('returns true if only one document has downloadExpired as true', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ];
      const result = OpenEAppController._hasApplicationExpired(
        resolvedOrbitData[0],
        21
      );

      // then
      expect(result).to.be.true;
    });

    it('returns true if days left to download is below 0', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ];
      const result = OpenEAppController._hasApplicationExpired(
        resolvedOrbitData[0],
        -1
      );

      // then
      expect(result).to.be.true;
    });
  });

  describe('downloadReceipt', () => {
    beforeEach(() => {
      sandbox.stub(stream, 'finished').returns(null);
      sandbox.stub(util, 'promisify').callsFake(() => () => null);
    });

    it('triggers serverError when user is not logged in', async () => {
      // when
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: false,
      }));
      sandbox.stub(Application, 'findOne').resolves({ user_id: 123 });
      await OpenEAppController.downloadReceipt(reqStub, resStub);

      // then
      expect(resStub.serverError.calledOnce).to.be.true;
    });

    it('triggers serverError if application ref is undefined', async () => {
      // when
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: true,
      }));
      reqStub.params.applicationRef = 'undefined';
      sandbox.stub(Application, 'findOne').resolves({ user_id: 123 });
      await OpenEAppController.downloadReceipt(reqStub, resStub);

      // then
      expect(resStub.serverError.calledOnce).to.be.true;
    });

    it("prevents the user from downloading someone else's receipt", async () => {
      // when
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: true,
      }));
      sandbox.stub(Application, 'findOne').resolves({ user_id: 456 });
      await OpenEAppController.downloadReceipt(reqStub, resStub);

      // then
      expect(resStub.serverError.calledOnce).to.be.true;
    });
  });

  describe('allDocumentsRejected', () => {
    beforeEach(() => {
      sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
        loggedIn: true,
      }));
      sandbox
        .stub(Date, 'now')
        .callsFake(() => TWELVE_DAYS_AFTER_COMPLETION);
      findApplicationData = sandbox
        .stub(Application, 'findOne')
        .resolves(resolvedAppData);
      sandbox.stub(OpenEAppController, '_getUserRef').resolves('');
    });

    it('returns false if no documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ];
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }];
      sandbox
        .stub(OpenEAppController, '_getApplicationDataFromOrbit')
        .resolves(updatedCasebookData);
      await OpenEAppController.renderPage(reqStub, resStub);

      // then
      expect(resStub.view.getCall(0).args[1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 10,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: false,
        allDocumentsRejected: false,
        caseManagementReceiptLocation: undefined,
        documents
      });
    });

    it('returns false if some documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
      ];
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }];
      sandbox
        .stub(OpenEAppController, '_getApplicationDataFromOrbit')
        .resolves(updatedCasebookData);
      await OpenEAppController.renderPage(reqStub, resStub);

      // then
      expect(resStub.view.getCall(0).args[1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 10,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: true,
        allDocumentsRejected: false,
        caseManagementReceiptLocation: undefined,
        documents
      });
    });

    it('returns true if all documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
      ];
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }];
      sandbox
        .stub(OpenEAppController, '_getApplicationDataFromOrbit')
        .resolves(updatedCasebookData);
      await OpenEAppController.renderPage(reqStub, resStub);

      // then
      expect(resStub.view.getCall(0).args[1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 10,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: true,
        allDocumentsRejected: true,
        caseManagementReceiptLocation: undefined,
        documents
      });
    });
  });
});
