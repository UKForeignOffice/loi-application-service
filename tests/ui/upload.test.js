const { screen } = require("@testing-library/dom");
const { default: userEvent } = require("@testing-library/user-event");
const path = require("path");
const ejs = require("ejs");

const loadDom = async ({ filePath, data }) => {
  const targetFile = path.resolve(__dirname, filePath);
  document.body.innerHTML = await ejs.renderFile(targetFile, data, {
    async: true,
  });
};

const ejsPartialNotDefinedHack = {
  partial: jest.fn(),
};

const initialPageData = {
  session: "",
  formInputName: "documents",
  error_report: false,
  user_data: {
    loggedIn: false,
    user: {
      id: 123,
    },
  },
  uploadedFiles: [],
  errors: [],
  fileCountErrorMsg: false,
  generalMessage: null,
  ...ejsPartialNotDefinedHack,
};

describe("File upload page", () => {
  beforeEach(() =>
    loadDom({
      filePath: "../../views/eApostilles/uploadFiles.ejs",
      data: initialPageData,
    })
  );

  describe("Without JavaScript", () => {
    it("should render a main heading", () => {
      const heading = screen.queryByText("Add your PDFs");
      expect(heading).toBeInTheDocument();
    });

    it("should upload files when the file input changes", (done) => {
      const form = screen.queryByTestId("upload-form");
      const input = screen.queryByLabelText("Upload files");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        expect(e.target.action.endsWith("/upload-file-handler/123")).toBeTrue();
        done();
      });
      const file = new File(["hello"], "hello.pdf", {
        type: "application/pdf",
      });
      userEvent.upload(input, file, { changeInit: true });
      const submitButton = screen.queryByText("Upload", {
        selector: "button",
      });
      userEvent.click(submitButton);
    });
  });
});
