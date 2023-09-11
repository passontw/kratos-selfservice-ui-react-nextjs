import isEmpty from 'lodash/isEmpty'
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import queryString from 'query-string';
import ory from "../pkg/sdk"
import { LogoutLink } from "../pkg"

const {NEXT_PUBLIC_REDIRECT_URI} = process.env;

const deactiveSession = (qs, router, onLogout) => {
  onLogout()
  const nextUri = isEmpty(qs)
     ? '/login'
     : `/login?${qs}`;

     router.push(nextUri);
}
const Sso: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const qs = queryString.stringify(router.query);
  const onLogout = LogoutLink()

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      setUser(data?.identity?.traits || {});
      setLoading(false);
    }).catch(error => {
      setLoading(false);
    })
  }, []);

  if (loading && isEmpty(user)) {
    return (<p>載入中........</p>)
  }
  
  if (!loading && isEmpty(user)) {
    const nextUri = isEmpty(qs)
    ? '/login'
    : `/login?${qs}`
    return (<a href={nextUri}>登入</a>)
  }

  return (
    <>
      <img src={user.avatar} />
      <button onClick={() => {
        router.push(NEXT_PUBLIC_REDIRECT_URI);
      }}>是否要以 {user.name} 繼續登入？ Email: {user.email}</button>
      <button onClick={() => {
        deactiveSession(qs, router, onLogout);
      }}>以其他帳號登入</button>
    </>
  )
}

export default Sso;
