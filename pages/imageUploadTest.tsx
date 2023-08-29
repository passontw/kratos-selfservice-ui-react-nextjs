import { useEffect } from "react"

const ImageUploadTest = () => {
  useEffect(() => {
    async function getData() {
      const dataJSON = await fetch("http:localhost:3000/image/create")
      const data = await dataJSON.json()

      console.log("data", data)
    }

    getData()
  }, [])

  return (
    <div>
      Image Upload Test
      <input type="file" accept="image/*" />
    </div>
  )
}

export default ImageUploadTest
