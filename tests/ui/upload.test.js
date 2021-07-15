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

const mockSessionData = {
  eApp: {
    uploadedFileData: [],
    uploadMessages: {
      errors: [],
      fileCountError: false,
      infectedFiles: [],
    },
  },
};

const initialPageData = (sessionData = mockSessionData) => ({
  formInputName: "documents",
  error_report: false,
  user_data: {
    loggedIn: false,
  },
  ...ejsPartialNotDefinedHack,
  req: {
    session: sessionData,
  },
});

describe("File upload page", () => {
  beforeEach(() =>
    loadDom({
      filePath: "../../views/eApostilles/uploadFiles.ejs",
      data: initialPageData(),
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
        expect(e.target.action.endsWith("/upload-file-handler")).toBeTrue();
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

    it("should have the pdf accept attribute on the upload input", () => {
      // when
      const uploadInput = screen.queryByTestId("upload-input");
      // then
      expect(uploadInput).toHaveAttribute("accept", "application/pdf");
    });
  });

  describe.only("with an error", () => {
    it("should show an error message if a file is infected", async () => {
      // when
      const testData = {
        eApp: {
          uploadedFileData: [],
          uploadMessages: {
            errors: [],
            fileCountError: false,
            infectedFiles: ["infectedFile.pdf"],
          },
        },
      };
      await loadDom({
        filePath: "../../views/eApostilles/uploadFiles.ejs",
        data: initialPageData(testData),
      });
      // then
      const alertHeading = screen.queryByText("There is a problem");
      const alertSection = screen.queryByRole("alert");
      expect(alertHeading).toBeInTheDocument();
      expect(alertSection).toHaveTextContent(
        "The following files have been identified as infected and therfore were not uploaded:"
      );
    });

    it("should show an error message if maximum file length exceeded", async () => {
      // when
      const testData = {
        eApp: {
          uploadedFileData: [],
          uploadMessages: {
            errors: [],
            fileCountError: true,
            infectedFiles: [],
          },
        },
      };
      await loadDom({
        filePath: "../../views/eApostilles/uploadFiles.ejs",
        data: initialPageData(testData),
      });
      // then
      const alertHeading = screen.queryByText("There is a problem");
      const alertSection = screen.queryByRole("alert");
      expect(alertHeading).toBeInTheDocument();
      expect(alertSection).toHaveTextContent(
        "More than 20 PDFs were uploaded. Select a maximum of 20 PDFs to upload."
      );
    });

    it.only("should show an error if a file has a problem", async () => {
      // when
      const testData = {
        eApp: {
          uploadedFileData: [],
          uploadMessages: {
            errors: [
              {
                filename: "badFile.pdf",
                errors: ["The file is in the wrong format. Only .pdf files are allowed."],
              },
            ],
            fileCountError: false,
            infectedFiles: [],
          },
        },
      };
      await loadDom({
        filePath: "../../views/eApostilles/uploadFiles.ejs",
        data: initialPageData(testData),
      });
      // then
            screen.debug();
      const alertHeading = screen.queryByText("There is a problem");
      const alertSection = screen.queryByRole("alert");
      expect(alertHeading).toBeInTheDocument();
      screen.debug();
    });
  });
});
