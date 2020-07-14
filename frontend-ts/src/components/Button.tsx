import React, { FC, ReactNode, MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  type?: string;
  size?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const types: {[key: string]: string} = {
  'light': 'bg-gray-100 text-gray-900 border-gray-100 hover:text-blue-800 focus:text-blue-800',
  'primary': 'bg-blue-600 text-blue-100 border-blue-600 hover:border-blue-500 hover:bg-blue-500 focus:border-blue-500 focus:bg-blue-500',
};

const sizes: {[key: string]: string} = {
  'normal': 'px-4 py-2',
  'lg': 'px-6 py-3 text-lg font-semibold',
};

const Button: FC<Props> = ({ children, className, type, size, onClick }) => {
  const classList = `block rounded-full border-2 ${(type && types[type]) || types.light} ${(size && sizes[size]) || sizes.normal} ${className}`;
  
  return (
    <button className={classList} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
