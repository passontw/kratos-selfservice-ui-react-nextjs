import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return axios.get("https://auth.passon.tw/admin/identities", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ORY_PAT}`,
      },
    }).then(response => {
      console.log("🚀 ~ file: index.tsx:24 ~ useEffect ~ response:", response)
      return (
        res
          .status(200)
          // pass it to the frontend to re-route back to hydra
          .json({ status: 200, data: response.data })
      )
    });

}