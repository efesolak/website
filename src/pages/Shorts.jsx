import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

function Shorts() {
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  // Sample shorts data
  const shorts = [
    {
      id: '1',
      author: {
        id: 'user1',
        name: 'CyberPro',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1732-large.mp4',
      caption: 'Quick tutorial on securing your code against common vulnerabilities #coding #security',
      likes: 245,
      comments: 37
    },
    {
      id: '2',
      author: {
        id: 'user2',
        name: 'SecurityGuru',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-man-hacker-working-on-a-computer-pressing-enter-1739-large.mp4',
      caption: 'How to protect yourself from phishing attacks in 60 seconds #phishing #cybersecurity',
      likes: 189,
      comments: 24
    },
    {
      id: '3',
      author: {
        id: 'user3',
        name: 'CodeMaster',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-who-writes-program-code-on-a-1728-large.mp4',
      caption: 'Never do this in your code if you want to stay secure! #security #programming',
      likes: 356,
      comments: 52
    }
  ];

  const handleShortInView = (inView, index) => {
    if (inView) {
      setCurrentShortIndex(index);
      // Play the current video and pause others
      Object.keys(videoRefs.current).forEach(key => {
        if (parseInt(key) === index) {
          if (isPlaying) {
            videoRefs.current[key].play().catch(err => console.error('Error playing video:', err));
          }
        } else {
          videoRefs.current[key].pause();
        }
      });
    }
  };

  const togglePlay = (index) => {
    if (currentShortIndex === index) {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        videoRefs.current[index].pause();
      } else {
        videoRefs.current[index].play().catch(err => console.error('Error playing video:', err));
      }
    }
  };

  const toggleMute = (index) => {
    if (currentShortIndex === index) {
      setIsMuted(!isMuted);
      videoRefs.current[index].muted = !isMuted;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto mb-8">
        <h1 className="text-2xl font-bold text-text mb-4">Security Shorts</h1>
        <p className="text-gray-300">
          Quick cybersecurity tips and solutions. Swipe through these short videos to learn about protecting yourself online.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        {shorts.map((short, index) => {
          const { ref, inView } = useInView({
            threshold: 0.7,
            onChange: (inView) => handleShortInView(inView, index)
          });
          
          return (
            <motion.div
              key={short.id}
              ref={ref}
              initial={{ opacity: 0.7, scale: 0.95 }}
              animate={{ 
                opacity: currentShortIndex === index ? 1 : 0.7, 
                scale: currentShortIndex === index ? 1 : 0.95
              }}
              transition={{ duration: 0.3 }}
              className="relative mb-6 rounded-xl overflow-hidden h-[70vh] bg-gray-900"
            >
              <video
                ref={el => { videoRefs.current[index] = el }}
                src={short.video}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  {/* Video controls */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => togglePlay(index)}
                      className="bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                    >
                      {isPlaying && currentShortIndex === index ? <FaPause /> : <FaPlay />}
                    </button>
                    <button 
                      onClick={() => toggleMute(index)}
                      className="bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  </div>
                </div>
                
                <div>
                  {/* Author info */}
                  <div className="flex items-center mb-3">
                    <img 
                      src={short.author.avatar} 
                      alt={short.author.name}
                      className="w-10 h-10 rounded-full border-2 border-accent"
                    />
                    <div className="ml-2">
                      <h3 className="font-semibold text-white">{short.author.name}</h3>
                      <p className="text-xs text-gray-300">Follow</p>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-white mb-4">{short.caption}</p>
                  
                  {/* Interaction buttons */}
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button className="flex flex-col items-center text-white">
                        <div className="bg-black/30 rounded-full p-2 mb-1 hover:bg-black/50">
                          <FaHeart />
                        </div>
                        <span className="text-xs">{short.likes}</span>
                      </button>
                      <button className="flex flex-col items-center text-white">
                        <div className="bg-black/30 rounded-full p-2 mb-1 hover:bg-black/50">
                          <FaComment />
                        </div>
                        <span className="text-xs">{short.comments}</span>
                      </button>
                      <button className="flex flex-col items-center text-white">
                        <div className="bg-black/30 rounded-full p-2 mb-1 hover:bg-black/50">
                          <FaShare />
                        </div>
                        <span className="text-xs">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Shorts;