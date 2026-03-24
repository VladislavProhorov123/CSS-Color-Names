import { useEffect, useState } from "react"

export const useDebounce = (value: string, delay = 500) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}