import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='h-screen mt-10 max-auto  w-fit mx-auto '>
    <div className='flex flex-col justify-center '>
        <img src='https://firebasestorage.googleapis.com/v0/b/learn-tech-ef5c2.appspot.com/o/images-404.png?alt=media&token=8b07223d-dece-445d-b14e-d9392c2f695c' alt='404' className='object-cover '/>
        <Link to='/' className='mx-auto mt-5'><Button color='dark'>Go back home</Button></Link></div>
    </div>
  )
}
