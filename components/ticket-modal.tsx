"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TicketModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop - no onClick handler so it can't be closed */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-gradient-to-b from-purple-900 to-pink-900 rounded-xl p-8 max-w-md w-full border-2 border-yellow-400 shadow-2xl"
          >
            {/* No close button */}
            
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl">🎵</span>
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-3">
                Tickets aren&apos;t on sale yet!
              </h2>
              <p className="text-cyan-300 mb-6">
                Be the first to know when tickets become available for the smoothest yacht rock experience in San Diego!
              </p>
              
              {/* Single button that redirects to homepage */}
              <Link
                href="/"
                onClick={onClose}
                className="block w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Get Notified When Tickets Go On Sale
              </Link>
              
              <p className="text-white/60 text-sm mt-4">
                Join our Captain&apos;s List for exclusive early access
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}