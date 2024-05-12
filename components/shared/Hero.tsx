"use client";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { MouseParallax } from "react-just-parallax";

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
	const controls = useAnimation();

	useEffect(() => {
		const restartAnimation = async () => {
			await controls.start("hidden");
			await controls.start("visible");
		};

		restartAnimation();
	}, []);

	return (
		<section className="relative flex w-full items-start justify-center h-[100vh] py-12 px-16">
			<motion.div
				className="flex flex-col absolute w-full items-start overflow-hidden justify-center h-[100vh] py-12 px-16"
				initial={{
					opacity: 0,
				}}
				animate={controls}
				variants={staggerVariants}
			>
				<h2 className="text-6xl tracking-tight leading-none bg-clip-text bg-gradient-to-r from-[#ffffff] to-[rgba(255,255,255,0.42)] lg:text-8xl md:text-8xl sm:text-7xl transition-all">
					<motion.span variants={charVariants}>We</motion.span>{" "}
					<motion.span variants={charVariants}>are</motion.span>
					<motion.video
						variants={videVariant}
						src="/heroStock.mp4"
						width={130}
						height={200}
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
				</h2>

				<motion.p className="text-xl italic w-1/3 text-white/60 py-4">
					We are the top notch Jewelry store we Shop with us right now
				</motion.p>
				<motion.button className="px-14 py-6 text-xl border-2 rounded-full redbtn" data-cursor-text="SHOP NOW">
					<span className="spani">SHOP NOW</span>
				</motion.button>
			</motion.div>

			<div className="w-full absolute flex items-center justify-end px-32 right-0 h-full">
				<motion.div
					className="relative"
					initial={{
						opacity: 0,
						scale: 0,
					}}
					animate={{
						opacity: 1,
						scale: 1,
						transition: {
							duration: 0.4,
							delay: 0.3,
							staggerChildren: 0.1,
							ease: "easeInOut",
						},
					}}
				>
					<div className="flex flex-col items-center justify-center ">
						<MouseParallax strength={0.01}>
							<Image
								src="/heroimg.png"
								alt=""
								width={400}
								height={400}
								className="md:mb-4"
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
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
