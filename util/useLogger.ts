import { useEffect } from "react"

// only logs on value change
const useLogger = (flag: string, ...args: [...unknown[]]) => {
  useEffect(() => {
    console.log(`${flag}`, ...args)
  }, [...args])
}

export default useLogger
