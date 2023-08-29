import * as fs from "fs"
import { NextApiRequest, NextApiResponse } from "next"

import { getFileCode } from "./create"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, email } = req.body
  // create file code which will be included in the file name
  const fileCode = getFileCode(name, email)

  // get file names from users storage folder
  const fileNames = fs.readdirSync("./users")
  const fileName = fileNames.find((file) => file.includes(fileCode))

  let file: string

  try {
    file = fs.readFileSync(`./users/${fileName}`, "utf8")
    console.log("file:", file)
    return res.status(200).json({
      file,
    })
  } catch (err) {
    console.log("Error while reading file:", err)
    return res.status(404).json({
      error: err,
    })
  }
}
