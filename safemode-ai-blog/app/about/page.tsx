"use client"

import { Header } from "@/components/header"
import { motion } from "framer-motion"
import { BrainCircuit, ShieldCheck, Eye, BarChartBig, Rss, Youtube, Mail } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image" // Aliasing the import

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
  bio: "A digital sentinel navigating the currents of artificial intelligence and cybersecurity. Dedicated to demystifying complex tech and fostering critical discussion on our digital future. This is a solo operation, driven by a passion for knowledge and a commitment to clarity.",
  avatar: "/placeholder.svg?height=150&width=150",
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
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] overflow-x-hidden">
      <Header />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-[-1] opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#61E8E1" strokeWidth="0.2" />
            </pattern>
            {/* Framer Motion cannot directly animate SVG pattern attributes like backgroundPosition.
                This part of the animation needs a different approach, possibly CSS or direct SVG animation.
                For now, removing the motion.pattern to avoid potential conflicts and simplify.
                A static grid will be shown.
            */}
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Section 1: Entry Point */}
        <motion.section
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#61E8E1] font-mono mb-4 glow-text">
            ACCESSING CORE_IDENTITY: SAFEMODE.AI
          </h1>
          <p className="text-lg md:text-xl text-[#AAAAAA] max-w-3xl mx-auto">
            Beyond the interface, into the digital nexus where intelligence meets inquiry.
          </p>
        </motion.section>

        {/* Section 2: Mission & Vision Matrix */}
        <motion.section className="mb-20 md:mb-28" variants={staggerContainer} initial="initial" animate="animate">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-10 text-center glow-text"
            variants={fadeIn}
          >
            SYSTEM_DIRECTIVES // Mission & Vision
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border hover:glow-border-intense transition-all"
              variants={fadeIn}
            >
              <h3 className="text-2xl font-semibold text-[#61E8E1] mb-3 font-mono">PRIMARY_MISSION: Illuminate</h3>
              <p className="text-[#AAAAAA] leading-relaxed">
                To dissect, demystify, and discuss the evolving landscapes of artificial intelligence and cybersecurity.
                We translate complex technological narratives into accessible insights, fostering informed perspectives
                in an increasingly digital world.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border hover:glow-border-intense transition-all"
              variants={fadeIn}
            >
              <h3 className="text-2xl font-semibold text-[#61E8E1] mb-3 font-mono">FUTURE_PROJECTION: Empower</h3>
              <p className="text-[#AAAAAA] leading-relaxed">
                To be a critical node in the network of digital literacy, empowering individuals and organizations to
                navigate the future with clarity and foresight. We envision a future where technology serves humanity,
                guided by ethical principles and collective understanding.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 3: Core Directives (Pillars) */}
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

        {/* Section 4: The Operator */}
        <motion.section
          className="mb-20 md:mb-28 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden glow-border-intense flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 120 }}
          >
            <NextImage
              src={operatorInfo.avatar || "/placeholder.svg"}
              alt="The Operator"
              fill
              className="object-cover"
            />
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

        {/* Section 5: Signal Boost (Connect) */}
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
                href: "mailto:contact@safemode.ai", // Placeholder
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
