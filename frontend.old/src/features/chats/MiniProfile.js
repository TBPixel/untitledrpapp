import React from 'react'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser'
import { FaUserAlt } from 'react-icons/fa'

const filterDangerousTags = (node) => {
  const tags = [
    'html',
    'head',
    'meta',
    'link',
    'script',
    'body',
    'iframe',
    'input',
    'textarea',
  ]

  if (node.type !== 'tag') {
    return
  }

  if (!tags.includes(node.name)) {
    return
  }

  return null
}

function MiniProfile({ name, picture, mini }) {
  const body = String(mini).trim()
  const hasBody = Boolean(body.length)
  const html = ReactHtmlParser(body, {
    transform: filterDangerousTags,
  })
  const render = html.length > 0 ? html : body

  return (
    <>
      {hasBody ? (
        <div className="w-full h-16">
          <div className="max-h-full">{render}</div>
        </div>
      ) : (
        <div className="flex justify-start items-start">
          <div className="flex rounded overflow-hidden">
            {picture ? (
              <>
                <img
                  className="block w-16 h-16 pr-2 object-contain"
                  src={picture}
                  alt={`${name}'s profile`}
                />
                <span>{name}</span>
              </>
            ) : (
              <>
                <div className="pr-2">
                  <FaUserAlt size={4 * 16} className="text-gray-500" />
                </div>
                <span>{name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

MiniProfile.propTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string,
  mini: PropTypes.string,
}

export default MiniProfile
