const {mkdir} = require("fs/promises")
const path = require("path");
const {readdir, rm} = require("fs/promises")
const {copyFile} = require("fs/promises")

const directory = path.join(__dirname, "files")
const directoryCopy = path.join(__dirname, "files-copy")

let counter = 0

async function copy(directory, copyDirectory) {
  try {
    await removeDirectory(copyDirectory)
  } catch {
  }
  await createDirectory(copyDirectory)
  await copyFiles(await getFiles(directory), directory, copyDirectory)
}

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
  try {
    for (const file of filesNames) {
      if (file.isFile()) {
        await copyFile(path.join(directory, file.name), path.join(copyDirectory, file.name))
        console.log(`Файл: ${file.name} скопирован в ${copyDirectory}`);
        counter+=1
      }
    }
  } finally {
    console.log(`Колличество скопированных файлов ${counter}`)
  }
};

copy(directory, directoryCopy);
