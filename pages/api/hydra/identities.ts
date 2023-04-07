import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
const reader = require('xlsx');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return axios.get(`${process.env.ORY_SDK_URL}/admin/identities`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ORY_PAT}`,
      },
    }).then((response) => {
      const data = response.data.map(user => ({ id: user.id, email: user.traits.email}))
      let workBook = reader.utils.book_new();
      const workSheet = reader.utils.json_to_sheet(data);
      reader.utils.book_append_sheet(workBook, workSheet, `response`);
      const exportFileName = `public/response.xls`;
      reader.writeFile(workBook, exportFileName);
      return (
        res
          .status(200)
          // pass it to the frontend to re-route back to hydra
          .json({ status: 200, data: response.data })
      )
    });
}