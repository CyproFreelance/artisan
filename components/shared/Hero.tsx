'use client'
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const staggerVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      ease: "easeInOut"
    }
  },
  hidden: {
    opacity: 0,
    y: 100,
  },
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    clipPath: "inset(0px 10px 100% 0px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0px -10px 0px 0px)",
  },
};

const HeroSection = () => {
  const controls = useAnimation();

  useEffect(() => {
    const restartAnimation = async () => {
      await controls.start("hidden");
      await controls.start("visible");
    };

    // Start animation after component has mounted
    restartAnimation();
  }, []); // Empty dependency array to ensure the effect runs only once after mounting

  return (
    <motion.section
      className="flex flex-col absolute w-full items-start justify-center h-[100vh] py-12 px-16"
      initial="hidden"
      animate={controls}
      variants={staggerVariants}
    >
      <h2 className="text-6xl tracking-tight leading-none text-white lg:text-9xl md:text-8xl sm:text-7xl transition-all">
        <motion.span variants={charVariants}>We</motion.span>
        {' '}
        <motion.span variants={charVariants}>are</motion.span>
        <br />
        <motion.span className='font-light italic' variants={charVariants}>Artisan&apos;s</motion.span>
        {' '}
        <motion.span variants={charVariants}>Bijou</motion.span>
        <br />
        <motion.span variants={charVariants}>and</motion.span>
        {' '}
        <motion.span className='font-light italic' variants={charVariants}>Jewelry</motion.span>
        <br />
      </h2>
    </motion.section>
  );
};

export default HeroSection;
