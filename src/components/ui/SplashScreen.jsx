import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#0a0c10] z-[9999] flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo / Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(215,25,32,0.3)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
            <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1" /><path d="M15 7.13v-1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-1c0-3.3 2.7-6 6-6s6 2.7 6 6v1c0 3.3-2.7 6-6 6Z" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 10.1 3.3 12.1 3.1 14.5" /><path d="M17.47 9c1.93 1.1 3.23 3.1 3.43 5.5" /><path d="M8.5 13h1" /><path d="M14.5 13h1" /><path d="m11.88 19 1.12-1.12" /><path d="m12.12 19-1.12-1.12" />
          </svg>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-3xl font-black tracking-tighter uppercase mb-4"
        >
          GCA <span className="text-accent underline decoration-4 underline-offset-8">AUTOMAÇÃO</span>
        </motion.h1>

        {/* Industrial Status Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-accent shadow-[0_0_15px_rgba(215,25,32,1)]"
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]"
        >
          Iniciando Sistemas de Controle...
        </motion.p>
      </div>
    </div>
  );
};

export default SplashScreen;
