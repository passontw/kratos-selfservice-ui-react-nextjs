import crypto from "crypto"
import fs from "fs"
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

  // check if the user folder exists
  const userFolderExists = fs.existsSync(STORAGE_PATH)
  if (!userFolderExists) {
    fs.mkdirSync(STORAGE_PATH)
  }

  fs.writeFile(fileName, file, (err) => {
    if (err) {
      console.log("Error caught while writing file:", err)
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

// TODO Cannot read properties of undefined (reading 'slice')
export const getFileCode = (name: string, email: string) => {
  const fileCode = `${name.slice(0, 4)}.${email}`
  const hashedFileCode = crypto
    .createHash("sha256")
    .update(fileCode)
    .digest("hex")
  return hashedFileCode
}
