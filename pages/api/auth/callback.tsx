import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from "next"
// import { getCookie, setCookie } from 'cookies-next';

export default async function handler(  
    req: NextApiRequest,
    res: NextApiResponse
) {
//   console.log('hello from callback.js', req.url);
//   const { code } = req.query
return res.status(200).json({
    status: 200,
    data: req.query,
});
//   const clientID = process.env.ORY_CLIENT_ID as string
//   const clientSecret = process.env.ORY_CLIENT_SECRET as string

  console.log('@auth code',code)
//   console.log('@auth clientID', clientID)
//   console.log('@auth clientSecret', clientSecret)

//   const code = req.url.substring(
//     req.url.lastIndexOf('=') + 1,
//     // req.url.indexOf('&'),
//   );
  // const { code } = req.body;
//   console.log('code', code);
//   const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
//   const clientSecret = process.env.ORY_CLIENT_SECRET;
//   const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  try {
    const params = new URLSearchParams();
    // params.append('userName', 'aa');
    // params.append("code", code)
    // params.append("client_id", clientID)
    // params.append("client_secret", clientSecret)
    // params.append("grant_type", "authorization_code")
    // params.append("redirect_uri", "https://cmid-ui.vercel.app/callback")
    // params.append('code', code);
    // params.append('client_id', clientID);
    // params.append('client_secret', clientSecret);
    // params.append('grant_type', 'authorization_code');
    // params.append('redirect_uri', redirectUri);

    // const response = await fetch(
    //   process.env.HYDRA_ADMIN_URL + '/oauth2/token',
    //   { method: 'POST', body: params },
    // );

    // console.log('response', response);
    // const data = await response.json();
    // console.log('data', data);
    // if (data && data.access_token && data.refresh_token) {
        
    //   const userinfoResponse = await fetch(
    //     process.env.ORY_SDK_URL + '/userinfo',
    //     {
    //       method: 'GET',
    //       headers: { Authorization: 'Bearer ' + data.access_token },
    //     },
    //   );
    //   const data2 = await userinfoResponse.json();
    //   if (data2.sub) {
    //     console.log('data2.sub', data2.sub);
    //     // setCookie('user_name', data2.sub, { req, res });
    //   }
    //   // console.log(data2);

    //   // res.status(200).redirect(307, '/welcome');
    //   // return res.status(200).json({
    //   //   status: 200,
    //   //   data2,
    //   // });
    // }
  } catch (err: any) {
    console.log('swapOAuth2Token error:', err);
   
    return res.status(err.response.status).json({
        status: err.response.status,
        msg: err.response.data.error_description,
      })
  }
  return res.status(200).json({});
//   return res.status(200).redirect(307, '/launch');
  // return res.redirect(200, 'http://localhost:3000');
}