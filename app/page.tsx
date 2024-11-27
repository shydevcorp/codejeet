"use client";

import { motion } from "framer-motion";
import React from "react";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/magicui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Home() {
  return (
    <div>
      <main>
        <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden ">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
            )}
          />
          <motion.div
            className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <BlurIn
                word="Padhlo chahe kahin se, selection hoga yahi se."
                className="font-display text-center text-4xl font-bold w-full lg:w-auto max-w-3xl mx-auto z-10"
                duration={1}
              />
            </motion.div>

            <motion.h2
              className="text-xl text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10"
              variants={itemVariants}
            >
              {" "}
              Let's struggle through company-wise LeetCode questions like a true
              Codejeet. Kyunki naukri ke liye sab kuch chalega!
            </motion.h2>

            <motion.div variants={itemVariants} className="z-20">
              <Link href="/dashboard">
                <Button size="lg" className="shadow-2xl mb-10">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedImage
                src="/image.webp"
                alt="Image"
                width={1200}
                height={900}
                className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
