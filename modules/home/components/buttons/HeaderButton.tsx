import { motion } from "framer-motion";

export const HeaderButton = () => {
    return (
     <motion.button
       aria-label="Crie sua experiência"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       whileHover={{ scale: 1.02 }}
       transition={{ type: "spring", stiffness: 400, damping: 17 }}
       className="group relative w-[92%] max-w-[380px] h-14 rounded-xs md:h-16 lg:h-20 xl:h-24 flex items-center justify-center p-1 bg-blue-baby shadow-[3px_3px_0px_1px_var(--color-primary)] active:shadow-none hover:bg-pink-light transition-all duration-300 cursor-pointer"
     >
       <div className="w-full h-full px-4 py-3 flex items-center justify-center border-2 border-primary rounded-xs relative">
         <span className="absolute text-xl md:text-2xl xl:text-3xl font-shrikhand text-primary translate-x-[0.5px] translate-y-[0.5px] pointer-events-none select-none">
           Crie sua Experiência
         </span>
         <span className="absolute text-xl md:text-2xl xl:text-3xl font-shrikhand text-pink-light group-hover:text-blue-baby transition-all duration-300 pointer-events-none select-none">
           Crie sua Experiência
         </span>
         <span
           className="absolute text-xl md:text-2xl xl:text-3xl font-shrikhand pointer-events-none select-none text-transparent"
           style={{
             WebkitTextStroke: "0.5px var(--color-primary)",
             WebkitTextFillColor: "transparent",
             color: "transparent",
           }}
         >
           Crie sua Experiência
         </span>
       </div>
     </motion.button>
    )
}