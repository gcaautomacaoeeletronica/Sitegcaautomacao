import React from 'react';
import { motion } from 'framer-motion';

const TechList = ({ items, title }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-[40px] group-hover:bg-accent/10 transition-colors pointer-events-none"></div>
      
      {title && (
        <div className="mb-6 flex items-center gap-3">
           <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
           <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      
      <ul className="space-y-4 relative z-10">
        {items.map((item, idx) => (
          <motion.li 
            key={idx} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start group/item bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-transparent hover:border-gray-100 transition-colors cursor-default"
          >
            <div className="mt-1 mr-4 w-5 h-5 flex-shrink-0 bg-blue-100 text-primary rounded-full flex items-center justify-center group-hover/item:bg-accent group-hover/item:text-white transition-colors duration-300">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <span className="text-gray-700 font-mono text-sm tracking-tight leading-relaxed group-hover/item:text-gray-900 transition-colors">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TechList;
