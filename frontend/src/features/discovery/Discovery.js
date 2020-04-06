import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as discovery from 'features/discovery/store'
import { FixedSizeList as List } from 'react-window'
import Form from 'features/discovery/Form'
import ProfileButton from 'features/discovery/ProfileButton'

function Discovery() {
  const discoveryRef = useRef()
  const [listHeight, setListHeight] = useState(0)
  const users = useSelector(discovery.SelectUsers)

  useEffect(() => {
    const discovery = discoveryRef.current
    if (discovery) {
      setListHeight(discovery.offsetHeight)
    }
  }, [])

  const Row = ({ index, style }) => (
    <div style={style}>
      <div className="py-1 overflow-hidden">
        <ProfileButton
          id={users[index].id}
          name={users[index].name}
          picture={users[index].picture}
          mini={users[index].mini}
        />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <Form />
      </div>
      <div className="flex-grow" ref={discoveryRef}>
        <List
          width="100%"
          height={listHeight}
          itemCount={users.length}
          itemSize={5 * 16 + 8}>
          {Row}
        </List>
      </div>
    </div>
  )
}

export default Discovery
