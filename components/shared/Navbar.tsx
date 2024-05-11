'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className='w-full h-28 flex items-center justify-between px-12 fixed z-[999]'>
      <Image
        src={'/logo.svg'}
        alt=''
        width={150}
        height={150}
      />
      <div className='flex items-center justify-center gap-3'>
        <Link href='/' className='px-6 py-2 border-2 text-white text-xl rounded-full redbtn' data-cursor-hide><span className='spani'>Login</span></Link>
        <button onClick={toggleSidebar} data-cursor-icon="arrow-left" className="hamburger-menu h-10 w-10 flex items-center justify-center cursor-pointer hover:translate-y-1 transition-all duration-700">
            <Menu />
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Navbar;
