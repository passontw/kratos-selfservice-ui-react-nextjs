import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {email} = req.query;
  return axios.get(`${process.env.ORY_SDK_URL}/admin/identities`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ORY_PAT}`,
      },
    }).then((response) => {
      const result = response.data.find(account => {
        return account.traits.email === email;
      });
      return (
        res
          .status(200)
          // pass it to the frontend to re-route back to hydra
          .json({ status: 200, data: result })
      )
    });
}