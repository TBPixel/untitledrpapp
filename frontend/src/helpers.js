import { useLayoutEffect, useState } from 'react'

export const useWindowSize = () => {
  let [size, setSize] = useState([0, 0])

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', updateSize)

    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

export const useInputChange = (initialState) => {
  const [input, setInput] = useState(initialState)

  const onInputChange = (e, value) => {
    setInput({
      ...input,
      [e.currentTarget.name]: value,
    })
  }

  return [input, onInputChange]
}
