import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="matrix-background">
          {Array(10).fill().map((_, i) => (
            <div 
              key={i}
              className="matrix-code"
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 15}s`
              }}
            >
              {Array(20).fill().map((_, j) => (
                <span key={j} style={{ opacity: Math.random() }}>
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center relative z-10"
      >
        <div className="card bg-primary/90 backdrop-blur-md p-8 rounded-xl border border-blue-900/40 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaExclamationTriangle className="text-warning text-6xl" />
              <motion.div
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 text-warning text-6xl"
              >
                <FaExclamationTriangle />
              </motion.div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-text mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you are looking for might have been moved, deleted, or possibly never existed.
          </p>
          
          <Link to="/" className="btn btn-primary inline-flex items-center justify-center">
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;