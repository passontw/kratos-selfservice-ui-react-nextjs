import * as fs from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import path from "path"

const STORAGE_PATH = "./users" as const

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { file, name, email } = req.body

  const fileName = createFileName(name, email)

  console.log("request body fileName:", fileName)

  fs.writeFile(fileName, file, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Image saved")
    }
  })

  return res.status(200).json({
    status: 200,
    data: "success",
  })
}

const createFileName = (name: string, email: string) => {
  const fileCode = getFileCode(name, email)
  const fileName = path.join(STORAGE_PATH, `${fileCode}.txt`)

  return fileName
}

export const getFileCode = (name: string, email: string) => {
  const fileCode = `${name.slice(0, 4)}.${email.slice(0, 4)}`
  return fileCode
}
