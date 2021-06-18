const { screen } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event')
const path = require('path')
const ejs = require('ejs')

const loadDom = async ({ filePath, data }) => {
  const targetFile = path.resolve(__dirname, filePath);
  document.body.innerHTML = await ejs.renderFile(targetFile, data, { async: true });
}

describe('File uploader', () => {
  beforeEach(() => loadDom({
    filePath: '../../views/eApostilles/uploadFiles.ejs',
    data: { session: '', user_data: {}, uploadedFiles: [] }
  }))

  describe('No JavaScript', () => {
    it('should render a main heading', () => {
      const heading = screen.queryByText('Add your documents')
      expect(heading).toBeInTheDocument()
    })

    it('should upload files when the file input changes', done => {
      const form = screen.queryByTestId('upload-form');
      const input = screen.queryByLabelText('Upload files')
      form.addEventListener('submit', e => {
        e.preventDefault()
        expect(e.target.action.endsWith('/upload-file-handler')).toBeTrue()
        done();
      });
      const file = new File(["hello"], "hello.pdf", { type: "application/pdf" })
      userEvent.upload(input, file, { changeInit: true })
      const submitButton = screen.queryByText('Upload files', { selector: 'button' })
      userEvent.click(submitButton);
    })
  });

  describe('With JavaScript', () => {
    it('should show a drag and drop prompt', async () => {
      require(process.cwd() + '/assets/js/multi-file-upload')
      const prompt = await screen.findByText('Drag and drop PDF files here or')
      expect(prompt).toBeInTheDocument();
    })
  });
})

