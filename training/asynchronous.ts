import fs from 'fs'
import util from 'util'

const promisifyReadFile = util.promisify(fs.readFile)

function main() {
    const readFilePromise = promisifyReadFile('package.json')

    readFilePromise.then((data) => {
        const fileContent = data.toString()
        console.log(fileContent)
    })
}

main()