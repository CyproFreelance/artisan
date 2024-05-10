import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <header className='w-full border-white h-28 flex items-center justify-between px-12'>
        <Image
            src={'/logo.svg'}
            alt=''
            width={150}
            height={150}
        />
    </header>
  )
}

export default Navbar