import React from 'react'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser'

const filterDangerousTags = node => {
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

const convertToKebabCase = str => {
  return str.replace(/\s+/g, '-').toLowerCase()
}

function MiniProfile({ name, picture, content }) {
  const body = String(content).trim()
  const hasBody = Boolean(body.length)
  const html = ReactHtmlParser(body, {
    transform: filterDangerousTags,
  })
  const render = html.length > 0 ? html : body

  return (
    <div
      id={`#${convertToKebabCase(name)}`}
      className="flex justify-start items-start">
      {hasBody ? (
        render
      ) : (
        <>
          {picture ? (
            <div className="block pr-3 rounded overflow-hidden">
              <img
                className="object-contain"
                src={picture}
                alt={`${name}'s profile`}
              />
            </div>
          ) : null}
          <span>{name}</span>
        </>
      )}
    </div>
  )
}

MiniProfile.propTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string,
  content: PropTypes.string,
}

export default MiniProfile
