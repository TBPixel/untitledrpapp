import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ name, value, required, disabled, setValue }) => (
  <input
    id={name}
    name={name}
    checked={value}
    required={required}
    disabled={disabled}
    onChange={(e) => setValue(e)}
    type="checkbox"
    className="absolute opacity-0 w-0 h-0"
  />
)

const SwitchInput = ({
  children,
  name,
  value,
  setValue,
  required,
  disabled,
  hideLabel,
}) => (
  <div className="flex flex-col">
    <label
      htmlFor={name}
      className={`${
        hideLabel ? 'sr-only' : ''
      } block text-gray-700 text-sm font-bold mb-2 mt-3 inline-flex items-center cursor-pointer`}>
      <span className="relative">
        <span
          className={`block w-10 h-6 rounded-full shadow-inner ${
            value ? 'bg-green-400' : 'bg-gray-400'
          }`}></span>
        {value === true ? (
          <>
            <span className="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-150 ease-in-out bg-white transform translate-x-full">
              <Checkbox
                name={name}
                value={value}
                setValue={setValue}
                required={required}
                disabled={disabled}
              />
            </span>
          </>
        ) : (
          <>
            <span className="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-150 ease-in-out">
              <Checkbox
                name={name}
                value={value}
                setValue={setValue}
                required={required}
                disabled={disabled}
              />
            </span>
          </>
        )}
      </span>
      <span className="ml-3 text-sm">{children}</span>
    </label>
  </div>
)

SwitchInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  hideLabel: PropTypes.bool,
}

export default SwitchInput
