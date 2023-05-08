const fs = require("fs")
const path = require("path")
const {readdir} = require("fs/promises")

const cssPath = path.join(__dirname, "styles")
const cssBundle = path.join(__dirname, "project-dist", "bundle.css")

function createFile(path) {
  fs.writeFile(path, "", (err) => {
    if (err) {
    }
  })
}

(async()=>{
  const copyFiles = await readdir(cssPath, {withFileTypes: true})
  createFile(cssBundle)
  for (const file of copyFiles){
    if(file.isFile() && (path.extname(path.join(cssPath, file.name)) === ".css")) {
      const rs = fs.createReadStream(path.join(cssPath, file.name), "utf-8")
      rs.on("data", chunk => {
        fs.appendFile(cssBundle, chunk, (err)=>{
          if (err) throw err;
        })
      })
    }
  }
})()

