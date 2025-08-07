"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const linkVariants = {
    closed: {
      x: 50,
      opacity: 0,
    },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const menuItems = [
    { href: "/lineup", label: "Lineup" },
    { href: "/schedule", label: "Schedule" },
    { href: "/tickets", label: "Tickets" },
  ];

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-3 bg-purple-600/80 backdrop-blur-sm rounded-full text-white hover:bg-purple-700/80 transition-colors shadow-lg"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-gradient-to-b from-purple-900 via-purple-800 to-pink-900 shadow-2xl z-40"
            >
              <div className="flex flex-col h-full p-8 pt-20">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
                    YACHT ROCK FESTIVAL
                  </h2>
                  
                  <ul className="space-y-6">
                    {menuItems.map((item, i) => (
                      <motion.li
                        key={item.href}
                        custom={i}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={linkVariants}
                      >
                        <Link
                          href={item.href}
                          onClick={toggleMenu}
                          className="block text-xl text-white hover:text-yellow-400 transition-colors py-2 font-semibold drop-shadow-lg"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <motion.div
                  custom={menuItems.length}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={linkVariants}
                  className="mt-auto"
                >
                  <Link
                    href="/tickets"
                    onClick={toggleMenu}
                    className="block w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold py-4 px-6 rounded-lg text-center text-lg transition-colors shadow-lg"
                  >
                    Get Notified
                  </Link>
                  
                  <div className="mt-6 pt-6 border-t border-purple-700/50">
                    <p className="text-sm text-purple-200">
                      SAT OCT 11, 2025 • 5PM - 10PM
                    </p>
                    <p className="text-xs text-purple-300 mt-2">
                      Liberty Station • Ingram Plaza
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}