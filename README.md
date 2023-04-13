# Cmid-admin-demo

## 環境變數

**.env**

```
ORY_SDK_URL= // Ory Sdk url Example: https://{projectId}.projects.oryapis.com
HYDRA_ADMIN_URL=// Ory Sdk url Example: https://{projectId}.projects.oryapis.com
ORY_PAT= // ORY Pat Client Secret key
NEXT_PUBLIC_REDIRECT_URI= // Client 端登入後呼叫的 callbak url 網址 Example: https://example.com/api/auth/callback
```

## Questions

* Services Managment
  * 因為這是 session 列表，並沒有紀錄來源的網址，所以無法顯示此 session 屬於哪一個網站
  