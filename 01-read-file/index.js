const fs = require("fs")
const path = require("path")
const filePath = path.join(__dirname, "text.txt")

function readFile(filePath) {
  const rs = fs.createReadStream(filePath, "utf-8")
  rs.on("data", chunk => {
    console.log(chunk)
  })
}

readFile(filePath)
