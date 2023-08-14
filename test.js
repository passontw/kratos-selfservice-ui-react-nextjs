const axios = require("axios");

const deleteAllAccounts = async () => {
  const identitiesResp = await axios.get(`https://eloquent-hamilton-chhgce5z6f.projects.oryapis.com/admin/identities`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ory_pat_tcI6RwkN0W642HemgDl2pTvFaQQnKktF`,
    },
  })
  
  const [identity] = identitiesResp.data;
  console.log("🚀 ~ file: test.js:11 ~ deleteAllAccounts ~ identity:", identity)
  const deleteResp = await axios.delete(`https://eloquent-hamilton-chhgce5z6f.projects.oryapis.com/admin/identities/${identity.id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ory_pat_tcI6RwkN0W642HemgDl2pTvFaQQnKktF`,
    },
  })
  console.log("🚀 ~ file: test.js:14 ~ deleteAllAccounts ~ deleteResp:", deleteResp)
}

deleteAllAccounts();