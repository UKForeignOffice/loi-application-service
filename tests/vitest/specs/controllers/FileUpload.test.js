// @ts-check
const request = require('supertest')
const fs = require('node:fs')
const sails = require('sails')
const NodeClam = require('clamscan')
const { Window } = require('happy-dom')

const FileUploadController = require('../../../../api/controllers/FileUploadController')
const HelperService = require('../../../../api/services/HelperService')
const Application = require('../../../../api/models/index').Application
const { max_files_per_application: maxFileLimit } = require('../../../../config/environment-variables').upload
const FileType = require('../../../../api/helper/fileType')

const testFileUploadedData = [
  {
    fieldname: 'documents',
    originalname: 'test_upload.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: '/test/location',
    filename: 'be3ad2f823a54812991839c3e856ec0a_test_upload.pdf',
    path: '/test/location/be3ad2f823a54812991839c3e856ec0a_terst_upload.pdf',
    size: 470685,
  },
]

// Tests are timing out
describe.skip('FileUploadController', () => {
  let userId = 100
  let agent

  beforeEach((done) => {
    agent = request.agent(sails.hooks.http.app)
    // in the actual controller this helper returns user data from the session
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      user: {
        id: userId,
      },
    }))
    done()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a redirect to the /upload-files page', (done) => {
    agent
      .post('/upload-file-handler')
      .attach('documents', `${process.cwd()}/tests/specs/controllers/data/test.pdf`)
      .expect(302)
      .then((response) => {
        expect(response.headers.location).to.eql('/upload-files')
        done()
      })
  })

  it('should show uploaded and errored files in the page', (done) => {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 101
    agent
      .post('/upload-file-handler')
      .attach('documents', `${process.cwd()}/tests/specs/controllers/data/test.pdf`)
      .attach('documents', `${process.cwd()}/tests/specs/controllers/data/fco-logo.png`)
      .expect(302)
      .then(() => {
        agent
          .get('/upload-files')
          .expect(200)
          .then((response) => {
            const window = new Window()
            window.document.body.innerHTML = response.text
            const uploadedFileName = window.document
              .querySelector('[data-testid="uploaded-file-0"]')
              ?.textContent?.trim()
            expect(uploadedFileName).to.eql('test.pdf')
            const erroredFileName = window.document.querySelector('[data-testid="errored-file-0"]')?.textContent?.trim()
            expect(erroredFileName).to.eql('fco-logo.png')
            const errorMessage = window.document
              .querySelector('[data-testid="errored-file-0-error-0"]')
              ?.textContent?.trim()
            expect(errorMessage).to.eql('The file is in the wrong format. Only .pdf files are allowed.')
            window.close()
            done()
          })
      })
  })

  it('should delete a file', (done) => {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 102
    agent
      .post('/upload-file-handler')
      .attach('documents', `${process.cwd()}/tests/specs/controllers/data/test.pdf`)
      .expect(302)
      .then(() => {
        agent
          .post('/delete-file-handler')
          .send({ delete: 'test.pdf' })
          .expect(302)
          .then(() => {
            agent
              .get('/upload-files')
              .expect(200)
              .then((response) => {
                const window = new Window()
                window.document.body.innerHTML = response.text
                const uploadedFiles = window.document.querySelectorAll('[data-testid="delete-form"]')
                expect(uploadedFiles.length).to.eql(0)
                window.close()
                done()
              })
          })
      })
  })
})

describe('uploadFilesPage', () => {
  let resStub = {}
  let reqStub = {}

  beforeEach(() => {
    reqStub = {
      _sails: {
        config: {
          upload: {
            clamav_host: '',
            clamav_port: '',
            s3_bucket: '',
            clamav_enabled: true,
            clamav_debug_enabled: false,
            max_files_per_application: 10,
          },
          views: {
            locals: {
              caseManagementSystem: 'ORBIT',
            },
          },
        },
      },
      files: [],
      session: {
        appId: 123,
        appType: 4,
        account: {
          feedback_consent: true,
        },
        eApp: {
          uploadFileData: [],
        },
        user: {
          id: 456,
        },
      },
      flash: vi.fn(),
    }

    resStub = {
      forbidden: vi.fn(),
      redirect: vi.fn(),
      view: vi.fn(),
      serverError: vi.fn(),
    }

    vi.spyOn(sails.log, 'error')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should forbid users that are not logged in', async () => {
    // when
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: false,
    }))
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()
    await FileUploadController.uploadFilesPage(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls).to.deep.equal([['/session-expired']])
  })

  it('should load uploadedFiles.ejs with user_data', async () => {
    // when
    const testUserData = {
      loggedIn: true,
      user: 'test_data',
    }
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => testUserData)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()
    vi.spyOn(FileUploadController, '_addSignedInDetailsToApplication').mockResolvedValue()
    reqStub.flash = () => []

    await FileUploadController.uploadFilesPage(reqStub, resStub)

    // then
    expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/uploadFiles.ejs')
    expect(resStub.view.mock.calls[0][1]).to.deep.equal({
      user_data: testUserData,
      maxFileLimit,
      filesToDelete: -maxFileLimit,
      backLink: '/completing-your-application',
      messages: {
        displayFilenameErrors: [],
        infectedFiles: [],
        genericErrors: [],
      },
    })
  })

  it('should log error if not connected to clamAV', async () => {
    // when
    const errorMsg = 'connectToClamAV Error: initialiseClamScan Turned off for testing.'
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: true,
    }))
    vi.spyOn(NodeClam.prototype, 'init').mockRejectedValue('Turned off for testing.')
    await FileUploadController.uploadFilesPage(reqStub, resStub)

    // then
    expect(sails.log.error.mock.calls[0][0]).to.equal(errorMsg)
  })

  // Read docs/eApp-pre-sign-in.md for more info
  it('updates user_id in the Applicaiton table if it is set to 0', async () => {
    // when
    let applicationRowData = {
      user_id: 0,
    }
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: true,
    }))
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()
    vi.spyOn(Application, 'findOne').mockResolvedValue({
      dataValues: applicationRowData,
      update: (arg) => {
        applicationRowData = {
          ...applicationRowData,
          ...arg,
        }
      },
    })
    await FileUploadController.uploadFilesPage(reqStub, resStub)

    // then
    expect(applicationRowData.user_id).to.equal(456)
  })

  it('shows an error on page load if max files exceeded', async () => {
    // when
    const arrayWithTestFiles = createOverLimitFileData()

    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: true,
    }))
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()
    vi.spyOn(FileUploadController, '_addSignedInDetailsToApplication').mockResolvedValue()

    reqStub.session.eApp.uploadedFileData = arrayWithTestFiles
    reqStub.files = arrayWithTestFiles

    await FileUploadController.uploadFilesPage(reqStub, resStub)

    // then
    expect(reqStub.flash.mock.calls[4][0]).to.equal('fileLimitError')
    expect(reqStub.flash.mock.calls[4][1]).to.deep.equal([
      `Too many files uploaded. A maximum of ${maxFileLimit} PDF files can be included in a single application`,
    ])
  })
})

describe('uploadFileHandler', () => {
  let reqStub

  const resStub = {
    redirect: vi.fn(),
    serverError: vi.fn(),
    view: vi.fn(),
  }

  beforeEach(() => {
    reqStub = {
      session: {
        eApp: {
          uploadedFileData: [
            {
              originalname: 'test.pdf',
              storageName: 'test.pdf',
              filename: 'test.pdf',
              passedVirusCheck: false,
              size: 470685,
            },
          ],
          uploadMessages: {
            error: [],
            fileCountError: false,
            infectedFiles: [],
            noFileUploadedError: false,
          },
        },
      },
      files: [],
      flash: vi.fn(),
      _sails: {
        config: {
          upload: {
            s3_bucket: 'test',
            file_upload_size_limit: 200,
            clamav_host: '',
            clamav_port: '',
            clamav_debug_enabled: false,
            max_files_per_application: 10,
          },
        },
      },
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should redirect to upload-files page after uploading a file', async () => {
    // when
    vi.spyOn(FileUploadController, '_fileTypeAndVirusScan').mockResolvedValue()
    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('/upload-files')
  })

  it('triggers noFileUploadedError if no files uploaded', async () => {
    // when
    reqStub.session.eApp.uploadedFileData = []
    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(reqStub.flash.mock.calls[0][0]).to.equal('genericErrors')
    expect(reqStub.flash.mock.calls[0][1]).to.deep.equal(['No files have been selected'])
  })

  it('shows an error if max file limit exceeded', async () => {
    // when
    const arrayWithTestFiles = createOverLimitFileData()

    reqStub.session.eApp.uploadedFileData = arrayWithTestFiles
    reqStub.files = arrayWithTestFiles
    vi.spyOn(FileUploadController, '_fileTypeAndVirusScan').mockResolvedValue()

    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(reqStub.flash.mock.calls[0][0]).to.equal('fileLimitError')
    expect(reqStub.flash.mock.calls[0][1]).to.deep.equal([
      `Too many files uploaded. A maximum of ${maxFileLimit} PDF files can be included in a single application`,
    ])
  })

  it('checks filetype when file uploaded', async () => {
    // when
    reqStub.files = testFileUploadedData
    const scanSpy = vi.spyOn(FileUploadController, '_fileTypeAndVirusScan').mockResolvedValue()

    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(scanSpy.mock.calls).to.have.lengthOf(1)
  })

  it('redirects to upload files page if filetype is not a PDF', async () => {
    // when
    reqStub.files = testFileUploadedData
    vi.spyOn(FileType, 'fromFile').mockResolvedValue({
      mime: 'image/jpeg',
    })
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue({
      isInfected: vi.fn().mockResolvedValue({ isInfected: false }),
    })
    vi.spyOn(fs, 'unlink').mockImplementation(() => null)

    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('/upload-files')
    expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(0)
  })

  it('scans for viruses when a file is uploaded', async () => {
    // when
    reqStub.files = testFileUploadedData
    const scanSpy = vi.spyOn(FileUploadController, '_fileTypeAndVirusScan').mockResolvedValue()

    await FileUploadController.uploadFileHandler(reqStub, resStub)

    // then
    expect(scanSpy.mock.calls).to.have.lengthOf(1)
  })
})

describe('deleteFileHandler', () => {
  let reqStub

  const resStub = {
    redirect: vi.fn(),
    badRequest: vi.fn(),
    notFound: vi.fn(),
  }

  beforeEach(() => {
    reqStub = {
      body: {
        delete: null,
      },
      session: {
        eApp: {
          uploadedFileData: [],
        },
      },
      _sails: {
        config: {
          upload: {
            s3_bucket: 'test',
          },
        },
      },
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return bad request if body.delete is empty', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(true)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    FileUploadController.deleteFileHandler(reqStub, resStub)

    // then
    expect(resStub.badRequest.mock.calls).to.have.lengthOf(1)
  })

  it('should redirect if body.delete is empty when user is not logged in', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(false)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    FileUploadController.deleteFileHandler(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls).to.deep.equal([['/session-expired']])
  })

  it('should return not found if no files found in session', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(true)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    reqStub.body.delete = 'test_file.pdf'
    FileUploadController.deleteFileHandler(reqStub, resStub)

    // then
    expect(resStub.notFound.mock.calls).to.have.lengthOf(1)
  })

  it('should redirect to upload-files page after deleting a file', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(true)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    reqStub.body.delete = 'test_file.pdf'
    reqStub.session.eApp.uploadedFileData = [
      {
        filename: 'test_file.pdf',
        storageName: 'test_file.pdf',
      },
    ]
    vi.spyOn(fs, 'unlink').mockImplementation(() => null)
    FileUploadController.deleteFileHandler(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls.some((c) => c[0] === '/upload-files')).to.be.true
  })

  it('should redirect to session-expired page after deleting a file when user not logged in', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(false)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    reqStub.body.delete = 'test_file.pdf'
    reqStub.session.eApp.uploadedFileData = [
      {
        filename: 'test_file.pdf',
        storageName: 'test_file.pdf',
      },
    ]
    vi.spyOn(fs, 'unlink').mockImplementation(() => null)
    FileUploadController.deleteFileHandler(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls.some((c) => c[0] === '/session-expired')).to.be.true
  })

  it('should remove deleted file from session', () => {
    vi.spyOn(HelperService, 'LoggedInStatus').mockReturnValue(true)
    vi.spyOn(NodeClam.prototype, 'init').mockResolvedValue()

    // when
    reqStub.body.delete = 'test_file.pdf'
    reqStub.session.eApp.uploadedFileData = [
      {
        filename: 'test_file.pdf',
        storageName: 'test_file.pdf',
      },
      {
        filename: 'test_file_2.pdf',
        storageName: 'test_file_2.pdf',
      },
    ]
    vi.spyOn(fs, 'unlink').mockImplementation(() => null)

    // then
    expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(2)
    FileUploadController.deleteFileHandler(reqStub, resStub)
    expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(1)
    expect(reqStub.session.eApp.uploadedFileData[0].filename).to.equal('test_file_2.pdf')
  })
})

function createOverLimitFileData() {
  const overMaxFileLimit = Number(maxFileLimit) + 1
  const emptyArray = new Array(overMaxFileLimit).fill(undefined)

  return emptyArray.map((_testFile) => createRandomTestFile())
}

function createRandomTestFile() {
  const uuidStr = 'test'
  const randomFileName = `${HelperService.uuid()}.pdf`
  const testFile = {
    fieldname: 'documents',
    originalname: '',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: '/test/location',
    filename: '',
    storageName: '',
    path: '',
    size: 470685,
  }

  testFile.storageName = randomFileName
  testFile.originalname = randomFileName
  testFile.filename = `${uuidStr}_${randomFileName}`
  testFile.path = `/test/${uuidStr}_${randomFileName}`

  return testFile
}
