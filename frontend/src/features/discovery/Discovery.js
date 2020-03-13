import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as discovery from 'features/discovery/store'
import { FixedSizeList as List } from 'react-window'
import Form from 'features/discovery/Form'
import ProfileButton from 'features/discovery/ProfileButton'

function Discovery() {
  const discoveryRef = useRef()
  const [listHeight, setListHeight] = useState(0)
  const dispatch = useDispatch()

  const users = useSelector(discovery.SelectUsers)
  useEffect(() => {
    dispatch(
      discovery.PushUsers({
        users: [
          {
            id: 1,
            name: 'Foo',
            picture: 'https://placekitten.com/64/64',
            content: '<h1>foo</h1>',
          },
          {
            id: 2,
            name: 'Bar',
            picture: 'https://placekitten.com/64/64',
            content: '',
          },
          {
            id: 3,
            name: 'Baz',
            picture: 'https://placekitten.com/64/64',
            content: '',
          },
        ],
      })
    )
  }, [])

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
          content={users[index].content}
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
          itemSize={72}>
          {Row}
        </List>
      </div>
    </div>
  )
}

export default Discovery
