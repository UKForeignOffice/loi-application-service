// @ts-check

let fileTypeModulePromise

function getFileTypeModule() {
  if (!fileTypeModulePromise) {
    fileTypeModulePromise = import('file-type')
  }

  return fileTypeModulePromise
}

async function fromFile(filePath) {
  const { fileTypeFromFile } = await getFileTypeModule()
  return fileTypeFromFile(filePath)
}

async function fromTokenizer(tokenizer) {
  const { fileTypeFromTokenizer } = await getFileTypeModule()
  return fileTypeFromTokenizer(tokenizer)
}

module.exports = {
  fromFile,
  fromTokenizer,
}
