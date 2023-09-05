import * as fs from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import NextCors from "nextjs-cors"

import { getFileCode } from "./create"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const { name, email } = req.body

  // create file code which will be included in the file name
  const fileCode = getFileCode(name, email)

  // get file names from users storage folder
  const fileNames = fs.readdirSync("./users")
  const targetfileName = fileNames.find((file) => file.includes(fileCode))

  let file: string
  // TODO Error: ENOENT: no such file or directory, scandir './users'
  try {
    file = fs.readFileSync(`./users/${targetfileName}`, "utf8")
    console.log("file:", file)
    return res.status(200).json({
      file,
    })
  } catch (err) {
    console.log("Error while reading file, image not found:", err)
    return res.status(404).json({
      error: err,
    })
  }
}
