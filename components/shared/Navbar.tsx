'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from './Sidebar';
import { AlignJustify } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className='w-full border-white h-28 flex items-center justify-between px-12 fixed z-[999]'>
      <Image
        src={'/logo.svg'}
        alt=''
        width={150}
        height={150}
      />
      <button onClick={toggleSidebar} className="hamburger-menu h-10 w-10 cursor-pointer">
          <AlignJustify />
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Navbar;
