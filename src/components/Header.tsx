"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";
import { Brush } from "lucide-react";

const pathVariants = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: {
    opacity: [0, 0, 5, 1],
    pathLength: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: [0, 1],
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
      delay: 1,
      type: "spring",
      bounce: 0.2,
      stiffness: 500,
      damping: 200,
    },
  },
};

function Header() {
  return (
    <header className="text-center mb-10">
      <motion.svg
        width="100%"
        height="400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fd8153"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.circle
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          cx="9"
          cy="12"
          r="1"
        />
        <motion.circle
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          cx="15"
          cy="12"
          r="1"
        />
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          d="M8 20v2h8v-2"
        />
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          d="m12.5 17-.5-1-.5 1h1z"
        />
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"
        />
      </motion.svg>
      <motion.h1
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
      >
        <span className="text-primary">Horrible </span>
        Sketches
      </motion.h1>
      <motion.p
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="text-lg text-center text-muted-foreground"
      >
        Because AI can do all the good ones.
      </motion.p>
      <motion.p variants={fadeUpVariants} initial="hidden" animate="visible">
        <Link href="/dashboard">
          <Button className="gap-1 mt-4">
            <span>Let&apos; Draw</span>
            <Brush size={14} />
          </Button>
        </Link>
      </motion.p>
    </header>
  );
}

export default Header;
