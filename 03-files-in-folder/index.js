const path = require("path");
const {readdir, stat} = require("fs/promises")

const directoryPath = path.join(__dirname, "secret-folder")

async function filesFolder(directoryPath) {
  const filesList = await readdir(directoryPath, {withFileTypes: true});
  for (const file of filesList) {
    if (file.isFile()) {
      const fileName = file.name.split(".")[0]
      const fileExtName = path.extname(file.name)
      const fileSize = await stat(path.join(directoryPath, file.name))
      console.log(fileName, fileExtName, fileSize.size)
    }
  }
};

filesFolder(directoryPath)
