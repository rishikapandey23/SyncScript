import React from 'react'
import './Button.scss'

const Button = ({children, onClick, backgroundColor, fontColor, scale, type}) => {
  return (
    <button type={(type) ? type : null} className='btn-main-container'>{children}</button>
  )
}

export default Button