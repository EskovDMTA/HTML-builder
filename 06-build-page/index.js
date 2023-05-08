const {mkdir} = require("fs/promises")
const path = require("path");
const {readdir, rm} = require("fs/promises")
const {copyFile} = require("fs/promises")
const fs = require("fs");
const {stat} = require("fs/promises")

const directoryAssets = path.join(__dirname, "assets")
const directoryProjectDist = path.join(__dirname, "project-dist")
const directoryStyles = path.join(__dirname, "styles")
const cssBundle = path.join(__dirname, "project-dist", "style.css")
const assetsDirectory = path.join(__dirname, "project-dist", "assets")
const templateHtml = path.join(__dirname, "template.html")
const copyTemplateHtml = path.join(__dirname, "project-dist", "template.html")
const componentsDirectory = path.join(__dirname, "components")

let components = {}
let tags = []

async function removeDirectory(directory) {
  await rm(directory, {recursive: true});
};

async function createDirectory(directory) {
  await mkdir(directory, {recursive: true});
};

async function getFiles(directory) {
  return await readdir(directory, {withFileTypes: true})
}

const copyFiles = async (filesNames, directory, copyDirectory) => {
  for (const file of filesNames) {
    if (file.isFile()) {
      await copyFile(path.join(directory, file.name), path.join(copyDirectory, file.name))
    } else if (file.isDirectory()) {
      copy(path.join(directoryAssets, file.name), path.join(copyDirectory, file.name))
    }
  }
};

async function createFile(path) {
  await fs.writeFile(path, "", (err) => {
  })
}

async function writeFromFile(pathFile, pathFileCopy, files) {
  for (const file of files) {
    const rs = fs.createReadStream(path.join(pathFile, file.name), "utf-8")
    rs.on("data", chunk => {
      fs.appendFile(pathFileCopy, chunk, (err) => {
        if (err) throw err;
      })
    })
  }
}

async function writeFileHtml(templateHtml, copyTemplateHtml, tags) {
  let file = (await fs.promises.readFile(templateHtml)).toString()
  tags.forEach((tag) => {
    file = file.replace(tag, components[tag])
  })
  await fs.writeFile(copyTemplateHtml, file, () => {
  })
}

async function writeFile(pathFile, pathFileCopy) {
  await createFile(pathFileCopy)
  const files = await getFiles(pathFile)
  await writeFromFile(pathFile, pathFileCopy, files)
};

async function writeComponents(componentsDirectory) {
  const files = await readdir(componentsDirectory, {withFileTypes: true})
  for (const file of files) {
    if (file.isFile() && (path.extname(path.join(componentsDirectory, file.name)) === ".html")) {
      const rs = await fs.promises.readFile(path.join(componentsDirectory, file.name), "utf-8")
      let fileName = file.name.split(".")[0]
      components[`{{${fileName}}}`] = rs.toString()
    }
  }
}

async function copy(directory, copyDirectory) {
  try {
    await removeDirectory(directoryProjectDist)
  } catch {
  }
  await createDirectory(copyDirectory)
  await createDirectory(assetsDirectory)
  await copyFiles(await getFiles(directory), directory, copyDirectory)
  await writeFile(directoryStyles, cssBundle)
  await writeFileHtml(templateHtml, copyTemplateHtml, tags)
}


(async () => {
  await writeComponents(componentsDirectory)
  tags = Object.keys(components)
})();

copy(directoryAssets, assetsDirectory);




