"use client"

import React from 'react';
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroBackground } from "../HeroBackground"

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <HeroBackground />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <p className="text-gray-500 text-sm uppercase tracking-wider mb-8">COW GROUP INTRODUCES</p>
        <h1 className="text-6xl md:text-8xl font-bold mb-6">Cycles of Wealth (COW)</h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto">
          The world's first performance real world asset tokens backed by gold and optimized assets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Explore Tokens
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;