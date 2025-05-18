import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  const matrixRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Add canvas to the matrix container
    if (matrixRef.current) {
      matrixRef.current.appendChild(canvas);
    }
    
    // Matrix characters
    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    
    // Array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100); // Start above the canvas
    }
    
    // Drawing the characters
    function draw() {
      // Black semi-transparent background to create fade effect
      ctx.fillStyle = "rgba(10, 25, 41, 0.1)";
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = "#00E5FF"; // Cyan color
      ctx.font = `${fontSize}px JetBrains Mono`;
      
      // Loop through each column
      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Increment y coordinate for next character in the column
        drops[i]++;
        
        // If we reach the bottom of the screen, randomly reset to top with some randomness
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    }
    
    // Animation loop
    const intervalId = setInterval(draw, 33); // ~30 fps
    
    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Recalculate columns
      const newColumns = Math.floor(width / fontSize);
      
      // Reset drops array
      drops.length = 0;
      for (let i = 0; i < newColumns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      if (matrixRef.current && matrixRef.current.contains(canvas)) {
        matrixRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div ref={matrixRef} className="absolute inset-0 overflow-hidden" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Deer horn logo SVG */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#00E5FF" strokeWidth="1.5"/>
            <path d="M8 9C8 9 9 7 12 7C15 7 16 9 16 9" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 14L9 19" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M17 14L15 19" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.5 11C7.5 11 9 15 12 15C15 15 16.5 11 16.5 11" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-text mb-4"
        >
          SSocieyt
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <span className="text-accent font-mono text-md">Loading</span>
          <motion.div
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="flex gap-1"
          >
            <span className="h-2 w-2 bg-accent rounded-full" />
            <span className="h-2 w-2 bg-accent rounded-full animation-delay-200" />
            <span className="h-2 w-2 bg-accent rounded-full animation-delay-400" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoadingScreen;