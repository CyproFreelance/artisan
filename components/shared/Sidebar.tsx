'use client'
// Sidebar.js
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Sidebar = ({ isOpen, onClose }:any) => {
  const sidebarRef = React.useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(sidebarRef.current, {
        duration: 0.2,
        x: '0%',
        ease: 'power4.inOut',
        stagger: 1,
      });
    } else {
      gsap.to(sidebarRef.current, {
        duration: 0.2,
        x: '100%',
        ease: 'power4.in',
        stagger: 4,
      });
    }
  }, [isOpen]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="overlay" onClick={onClose}></div>
      <div className="content">
        <div className="close-btn" onClick={onClose}>
          <span></span>
          <span></span>
        </div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
