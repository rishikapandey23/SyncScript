import React from 'react'
import Button from '../utility/Button'
import './Register.scss'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className='register-page-main-container'>
        <div className='register-page-btn-container'>
            <Link to="/signup"><Button>Sign Up</Button></Link>
            <Link to="/login"><Button>Log In</Button></Link>
        </div>
    </div>
  )
}

export default Register