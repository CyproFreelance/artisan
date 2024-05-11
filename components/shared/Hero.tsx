"use client";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MouseParallax } from "react-just-parallax"; // Import MouseParallax component

const staggerVariants = {
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			staggerChildren: 0.1,
			ease: "easeInOut",
		},
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

const videVariant = {
	hidden: {
		opacity: 0,
		scale: 0,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.4,
			delay: 0.7,
			staggerChildren: 0.1,
			ease: "easeInOut",
		},
	},
};

const HeroSection = () => {
	// const [mouseX, setMouseX] = useState(0);
	// const [mouseY, setMouseY] = useState(0);
	const controls = useAnimation();

	// const handleMouseMove = (event) => {
	//   const { clientX, clientY } = event;
	//   setMouseX(clientX);
	//   setMouseY(clientY);
	// };

	useEffect(() => {
		const restartAnimation = async () => {
			await controls.start("hidden");
			await controls.start("visible");
		};

		restartAnimation();
	}, []);

	return (
		<section
			className="relative flex w-full items-start justify-center h-[100vh] py-12 px-16"
			// onMouseMove={handleMouseMove}
		>
			<motion.div
				className="flex flex-col absolute w-full items-start overflow-hidden justify-center h-[100vh] py-12 px-16"
				initial="hidden"
				animate={controls}
				variants={staggerVariants}
			>
				<h2 className="text-6xl tracking-tight leading-none bg-clip-text bg-gradient-to-r from-[#ffffff] to-[rgba(255,255,255,0.42)] lg:text-9xl md:text-8xl sm:text-7xl transition-all">
					<motion.span variants={charVariants}>We</motion.span>{" "}
					<motion.span variants={charVariants}>are</motion.span>
					<motion.video
						variants={videVariant}
						src="/heroStock.mp4"
						width={200}
						height={250}
						className="rounded-full mx-9 inline-block"
						autoPlay
						muted
						loop
					/>
					<br />
					<motion.span className="font-light italic" variants={charVariants}>
						Artisan&apos;s
					</motion.span>{" "}
					<motion.span variants={charVariants}>Bijou</motion.span>
					<br />
					<motion.span variants={charVariants}>and</motion.span>{" "}
					<motion.span className="font-light italic" variants={charVariants}>
						Jewelry
					</motion.span>
					<br />
				</h2>
			</motion.div>

			<div className="w-1/2 absolute flex items-center justify-center right-0 h-full">
				<motion.div className="relative" variants={videVariant}>
					<MouseParallax strength={0.01}>
						<Image
							src="/heroimg.png"
							alt=""
							width={400}
							height={400}
							className=""
						/>
					</MouseParallax>

					<MouseParallax strength={0.05}>
						<Image
							src="/herosubimg.png"
							alt=""
							width={200}
							height={300}
							className="absolute right-0 bottom-0 rounded-lg"
						/>
					</MouseParallax>
			</motion.div>
				</div>
		</section>
	);
};

export default HeroSection;
