import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from 'components/forms/Input'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function ImageInput({ children, name, value, setValue, required, disabled }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1 / 1,
  })
  const [src, setSrc] = useState('')
  const [img, setImg] = useState('')

  function onCropComplete(crop) {
    if (!img || !crop.width || !crop.height) {
      return
    }

    getCroppedImg(img, crop, setImg)
    // setSrc(croppedImageUrl)
  }

  return (
    <Input name={name} label={children}>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={(e) => openFile(e, setSrc)}
        required={required}
        disabled={disabled}
      />
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onImageLoaded={(v) => setImg(v)}
          onComplete={onCropComplete}
          onChange={(crop) => setCrop({ ...crop })}
        />
      )}
    </Input>
  )
}

function openFile(e, setSrc) {
  if (!e.target.files || e.target.files.length <= 0) {
    return
  }

  const fileReader = new FileReader()
  fileReader.onloadend = () => {
    setSrc(fileReader.result)
  }
  fileReader.readAsDataURL(e.target.files[0])
}

function getCroppedImg(image, crop, setImg) {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  const reader = new FileReader()
  canvas.toBlob((blob) => {
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const file = dataURLtoFile(reader.result, 'cropped.jpg')
      setImg(file)
    }
  })
}

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

ImageInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default ImageInput
