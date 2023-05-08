const {mkdir} = require("fs/promises")
const path = require("path");
const {readdir, rm} = require("fs/promises")
const {copyFile} = require("fs/promises")
const fs = require("fs");
const {stat} = require("fs/promises")
const {write} = require("fs");

const directoryAssets = path.join(__dirname, "assets")
const directoryProjectDist = path.join(__dirname, "project-dist")
const directoryStyles = path.join(__dirname, "styles")
const cssBundle = path.join(__dirname, "project-dist", "bundle.css")
const templateHtml = path.join(__dirname, "template.html")
const copyTemplateHtml = path.join(__dirname, "project-dist", "template.html")
const articlesPath = path.join(__dirname, "components", "articles.html")
const footerPath = path.join(__dirname, "components", "footer.html")
const headerPath = path.join(__dirname, "components", "header.html")
let htmlData = []
let header = writeComponents(headerPath)
let articles = writeComponents(articlesPath)
let footer = writeComponents(footerPath)

async function removeDirectory(directory) {
  await rm(directory, {recursive: true});
};

async function createDirectory(directory) {
  await mkdir(directory, {recursive: true});
};

async function getFiles(directory, flag = "directory") {
  if (flag === "directory") {
    return await readdir(directory, {withFileTypes: true})
  }
  if (flag === "file") {
    return await stat(directory, {withFileTypes: true}, () => {
    })
  }
}

const copyFiles = async (filesNames, directory, copyDirectory) => {
  for (const file of filesNames) {
    if (file.isFile()) {
      await copyFile(path.join(directory, file.name), path.join(copyDirectory, file.name))
      console.log(`Файл: ${file.name} скопирован в ${copyDirectory}`);
    } else if (file.isDirectory()) {
      copy(path.join(directoryAssets, file.name), path.join(directoryProjectDist, file.name))
    }
  }
};


async function createFile(path) {
  await fs.writeFile(path, "", (err) => {
  })
}

async function writeFromFile(pathFile, pathFileCopy, files, flag = "directory") {
  if (flag === "directory") {
    for (const file of files) {
      const rs = fs.createReadStream(path.join(pathFile, file.name), "utf-8")
      rs.on("data", chunk => {
        fs.appendFile(pathFileCopy, chunk, (err) => {
          if (err) throw err;
        })
      })
    }
  }
  if (flag === "file") {
    const rs = fs.createReadStream(pathFile, "utf-8")
    rs.on("data", chunk => {
      let data = chunk
      data = data.replace("{{header}}", htmlData[0])
      data = data.replace("{{articles}}", htmlData[1])
      data = data.replace("{{footer}}", htmlData[2])
      fs.writeFile(pathFileCopy, data, (err) => {
        if (err) throw err;
      })
    })
  }
}

async function writeFile(pathFile, pathFileCopy, flag) {
  await createFile(pathFileCopy)
  const files = await getFiles(pathFile, flag)
  await writeFromFile(pathFile, pathFileCopy, files, flag)
};

async function writeComponents(pathFile) {
  const rs = fs.createReadStream(pathFile, "utf-8")
  await rs.on("data", chunk => {
    htmlData.push(chunk.toString())
  })
}

async function copy(directory, copyDirectory) {
  try {
    await removeDirectory(directoryProjectDist)
    articles = writeComponents(articlesPath)
  } catch {
  }

  await createDirectory(copyDirectory)
  await copyFiles(await getFiles(directory), directory, copyDirectory)
  await writeFile(directoryStyles, cssBundle)
  await writeFile(templateHtml, copyTemplateHtml, "file")


}

copy(directoryAssets, directoryProjectDist);
