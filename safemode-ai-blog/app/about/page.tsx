"use client"

import { useState, useEffect } from "react" // Added useState, useEffect
import { Header } from "@/components/header"
import { motion } from "framer-motion"
import { BrainCircuit, ShieldCheck, Eye, BarChartBig, Rss, Youtube, Mail, UserCircle } from "lucide-react" // Added UserCircle
import Link from "next/link"
import NextImage from "next/image"

interface AdminProfile {
  image: string | null
}

const coreDirectives = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-3 text-[#61E8E1]" />,
    title: "AI Ethics & Governance",
    description: "Navigating the complex moral and regulatory landscapes of artificial intelligence.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 mb-3 text-[#61E8E1]" />,
    title: "Cybersecurity Frontiers",
    description: "Exploring advanced threats, defensive strategies, and the future of digital protection.",
  },
  {
    icon: <Eye className="w-10 h-10 mb-3 text-[#61E8E1]" />,
    title: "Threat Intelligence & Analysis",
    description: "Dissecting emerging cyber threats and understanding attacker methodologies.",
  },
  {
    icon: <BarChartBig className="w-10 h-10 mb-3 text-[#61E8E1]" />,
    title: "Digital Intelligence Futures",
    description: "Investigating the broader impact of AI and digital technologies on society.",
  },
]

const operatorInfo = {
  title: "The Operator",
  handle: "@SafemodeAI_Host",
  bio: "A technology enthusiast dedicated to fostering critical discussion on our digital future. This is a solo operation, driven by a passion for knowledge and a commitment to clarity.",
  // Avatar will be loaded dynamically
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function AboutPage() {
  const [operatorAvatar, setOperatorAvatar] = useState<string | null>(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem("safemode-admin-profile")
    if (savedProfile) {
      const adminProfile: AdminProfile = JSON.parse(savedProfile)
      setOperatorAvatar(adminProfile.image)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] overflow-x-hidden">
      <Header />

      <div className="fixed inset-0 z-[-1] opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#61E8E1" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.section
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#61E8E1] font-mono mb-4 glow-text">
            ACCESSING CORE_IDENTITY: SAFEMODE.AI
          </h1>
        </motion.section>

        {/* Section: Core Modules (Pillars) - System Directives section removed */}
        <motion.section className="mb-20 md:mb-28" variants={staggerContainer} initial="initial" animate="animate">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-12 text-center glow-text"
            variants={fadeIn}
          >
            CORE_MODULES // Content Pillars
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreDirectives.map((directive, index) => (
              <motion.div
                key={index}
                className="p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border hover:glow-border-intense transition-all text-center flex flex-col items-center"
                variants={fadeIn}
              >
                {directive.icon}
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2 font-mono">{directive.title}</h3>
                <p className="text-sm text-[#AAAAAA] leading-relaxed">{directive.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mb-20 md:mb-28 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden glow-border-intense flex-shrink-0 bg-[#0D0D0D] flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 120 }}
          >
            {operatorAvatar ? (
              <NextImage src={operatorAvatar} alt="The Operator" fill className="object-cover" />
            ) : (
              <UserCircle className="w-3/4 h-3/4 text-[#61E8E1]/50" />
            )}
            <div className="absolute inset-0 bg-[#61E8E1]/10 animate-pulse"></div>
          </motion.div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-1 glow-text">
              {operatorInfo.title}
            </h2>
            <p className="text-md text-[#61E8E1]/80 font-mono mb-4">{operatorInfo.handle}</p>
            <p className="text-[#AAAAAA] leading-relaxed">{operatorInfo.bio}</p>
          </div>
        </motion.section>

        <motion.section variants={staggerContainer} initial="initial" animate="animate">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-10 text-center glow-text"
            variants={fadeIn}
          >
            ESTABLISH_CONNECTION // Engage
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Youtube className="w-8 h-8 text-[#61E8E1]" />,
                label: "YouTube Channel",
                href: "https://youtube.com/@safemodeai",
                text: "Visual deep dives & discussions.",
              },
              {
                icon: <Rss className="w-8 h-8 text-[#61E8E1]" />,
                label: "Blog Feed",
                href: "/articles",
                text: "Latest articles & insights.",
              },
              {
                icon: <Mail className="w-8 h-8 text-[#61E8E1]" />,
                label: "Contact Protocol",
                href: "mailto:contact@safemode.ai",
                text: "Direct inquiries & collaborations.",
              },
            ].map((link, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Link
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : "_self"}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : ""}
                  className="block p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border hover:glow-border-intense transition-all group h-full"
                >
                  <div className="flex items-center mb-3">
                    {link.icon}
                    <h3 className="ml-3 text-xl font-semibold text-[#EAEAEA] font-mono group-hover:text-[#61E8E1]">
                      {link.label}
                    </h3>
                  </div>
                  <p className="text-sm text-[#AAAAAA]">{link.text}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
