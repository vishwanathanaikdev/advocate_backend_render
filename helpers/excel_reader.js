const excelReader = require('xlsx')
const fs = require('fs')

exports.readExcel = (file, headersParam)=>{
    try {
        const readFile = excelReader.readFile(file.path)
        const sheets = readFile.SheetNames
        const headers = excelReader.utils.sheet_to_json(readFile.Sheets[['Sheet1']], { header: 1 })[0];
        let notIncluded = []
        if(headers) {
            for(let i = 0; i<headersParam.length; i++) {
                if(!headers.includes(headersParam[i])) {
                    notIncluded.push(headersParam[i])
                }
            }
            if(notIncluded.length) {
                return {
                    status: false,
                    errors: 'Invalid Headers',
                    notIncluded: notIncluded
                }
            }
        }
        else {
            return {
                status: false,
                errors: 'Invalid Excel File'
            }
        }
        let data = []
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = excelReader.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        fs.unlinkSync(file.path)
        return data
    }catch(err) {
        return false
    }
}