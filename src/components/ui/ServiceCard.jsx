import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';

const ServiceCard = ({ title, description, link = "/servicos", icon: Icon }) => {
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);

  return (
    <Link to={link} className="block group h-full">
       <div className={`relative h-full flex flex-col bg-white border border-gray-200 rounded transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:-translate-y-1 ${isVisualEditorActive ? 'overflow-visible' : 'overflow-hidden'}`}>
         
         {/* Top Accent Line */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-primary transition-all duration-300"></div>

         <div className="flex-1 p-8 flex flex-col relative z-10">
           
           {/* Icon Section with Soft Glow background on Hover */}
           <div className="relative mb-6">
              {Icon && (
                <div className="relative w-14 h-14 bg-gray-50 text-primary border border-gray-200 rounded flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={28} className="transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}
           </div>
           
           <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">{title}</h3>
           
           <p className="text-sm text-gray-500 leading-relaxed font-normal flex-grow mb-8 group-hover:text-gray-600 transition-colors">{description}</p>
           
           {/* Custom Button Link */}
           <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
             <span className="relative">
                Explorar Solução
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 hidden sm:block"></span>
             </span>
             <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-500" />
           </div>
         </div>
         
         {/* Subtle pattern bottom right */}
         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pattern-dots opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
       </div>
    </Link>
  );
};

export default ServiceCard;
