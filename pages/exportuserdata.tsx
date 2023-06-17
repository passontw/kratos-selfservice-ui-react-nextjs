import axios from "axios"
import { NextPage } from "next"
import {useEffect, useState} from "react"

const ExportUserData: NextPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/hydra/identities", {
      headers: {
        Accept: "application/json",
      },
    }).then(response => {
      setUsers(response.data.data);
    });
  }, []);
  return (
    <>
      <a href="/response.xls">Export User Data</a>
      <h1>Export User Data</h1>
      <div>you redirected to export user data page</div>
      {users.map((user, index) => {
        return (
          <div key={user.id}>{user.traits.email}</div>
        );
      })}
    </>
  )
}

export default ExportUserData