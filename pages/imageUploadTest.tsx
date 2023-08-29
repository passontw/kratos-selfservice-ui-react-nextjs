import { useEffect, useState } from "react"

import ory from "../pkg/sdk"

type User = {
  email: string
  location: string
  name: string
  loginVerification: boolean
  source: string
}

const ImageUploadTest = () => {
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    null,
  )

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      setUser(data?.identity?.traits || {})
    })
  }, [])

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setSelectedFile(event.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        if (!user) return
        const response = await fetch("/api/image/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            file: selectedFile,
          }),
        })

        if (response.ok) {
          console.log("File uploaded successfully")
        } else {
          console.error("File upload failed")
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  const handleGetImg = async () => {
    try {
      if (!user) return
      const response = await fetch("/api/image/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      })

      if (response.ok) {
        console.log("File get successfully")
      } else {
        console.error("File get failed")
      }
    } catch (error) {
      console.error("Error get file:", error)
    }
  }

  console.log("selectedFile:", selectedFile)
  console.log("user:", user)

  return (
    <div>
      Image Upload Test
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleGetImg}>Test get image</button>
    </div>
  )
}

export default ImageUploadTest
