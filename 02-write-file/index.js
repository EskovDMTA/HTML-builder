const fs = require("fs")
const path = require("path")

const {stdin, stdout} = process
const filePath = path.join(__dirname, "text.txt")

function createFile(path) {
  fs.writeFile(path, "", (err) => {
    if (err) {
      console.log("Возникла ошибка")
    }
  })
}

console.log("Программа записывает ввод данных с консоли в файл text.txt. Для выхода из программы напишите " +
    "'exit' в консоль или используйте комбинацию клавиш ctrl + c")
createFile(filePath)
console.log("Ожидаю ввод данных")

stdin.on("data", data => {
  if (data.toString() === "exit\n") {
    console.log(`Ваш файл  ${filePath}`)
    process.exit()
  }
  fs.appendFile(filePath, data, function (error) {
    if (error) throw error;
  });
});

process.on('SIGINT', () => {
  console.log(`Ваш файл  ${filePath}`)
  process.exit()
});
