'use client'
import Navbar from "@/components/shared/Navbar";
import Cursor from "@/components/shared/Cursor";
import HeroSection from "@/components/shared/Hero";
import { useEffect } from "react";

export default function Home() {

  return (
    <>
      {/* <Cursor /> */}
    <main className="bg-zinc-950 text-white flex h-screen flex-col">
      <Navbar/>
      <HeroSection/>
    </main>
    </>
  );
}
