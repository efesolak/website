import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  getDoc,
  doc,
  getDocs,
  and,
  or
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSearch, FaEllipsisH, FaUser, FaChevronLeft } from 'react-icons/fa';

function Chat() {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showConversations, setShowConversations] = useState(!userId);
  
  const messagesEndRef = useRef(null);
  
  // Sample data for demonstration purposes
  const sampleUsers = [
    {
      id: 'user1',
      name: 'David Chen',
      photoURL: 'https://i.pravatar.cc/150?img=11',
      lastActive: new Date(),
      isOnline: true
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      photoURL: 'https://i.pravatar.cc/150?img=5',
      lastActive: new Date(Date.now() - 15 * 60000),
      isOnline: false
    },
    {
      id: 'user3',
      name: 'Michael Smith',
      photoURL: 'https://i.pravatar.cc/150?img=3',
      lastActive: new Date(Date.now() - 2 * 3600000),
      isOnline: false
    }
  ];
  
  const sampleMessages = {
    user1: [
      {
        id: 'm1',
        senderId: 'user1',
        text: 'Hey there! I saw your post about cyber bullying. I\'ve been dealing with something similar.',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'm2',
        senderId: currentUser?.uid,
        text: 'Hi David! I\'m sorry to hear that. Would you like to talk about it?',
        timestamp: new Date(Date.now() - 3540000)
      },
      {
        id: 'm3',
        senderId: 'user1',
        text: 'Yes, I would appreciate that. It\'s been happening on my gaming server. Some users have been targeting me with offensive messages.',
        timestamp: new Date(Date.now() - 3480000)
      },
      {
        id: 'm4',
        senderId: currentUser?.uid,
        text: 'That\'s not okay. Have you documented the incidents? Screenshots or logs can be helpful when reporting.',
        timestamp: new Date(Date.now() - 3420000)
      },
      {
        id: 'm5',
        senderId: 'user1',
        text: 'I have some screenshots. But I\'m not sure who to report it to.',
        timestamp: new Date(Date.now() - 3360000)
      }
    ],
    user2: [
      {
        id: 'm1',
        senderId: currentUser?.uid,
        text: 'Hi Sarah, I saw your question about password managers in the forum.',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: 'm2',
        senderId: 'user2',
        text: 'Yes! I\'m trying to find a secure one that works well across devices.',
        timestamp: new Date(Date.now() - 82800000)
      },
      {
        id: 'm3',
        senderId: currentUser?.uid,
        text: 'I personally use Bitwarden. It\'s open-source, has great security, and works on all platforms.',
        timestamp: new Date(Date.now() - 79200000)
      },
      {
        id: 'm4',
        senderId: 'user2',
        text: 'Thanks! I\'ll check it out. Is it easy to import passwords from browsers?',
        timestamp: new Date(Date.now() - 75600000)
      }
    ],
    user3: [
      {
        id: 'm1',
        senderId: 'user3',
        text: 'Hello! I\'m organizing a virtual workshop on cybersecurity awareness. Would you be interested in participating?',
        timestamp: new Date(Date.now() - 172800000)
      },
      {
        id: 'm2',
        senderId: currentUser?.uid,
        text: 'That sounds great! When is it happening?',
        timestamp: new Date(Date.now() - 169200000)
      },
      {
        id: 'm3',
        senderId: 'user3',
        text: 'We\'re planning for next Saturday at 2 PM EST. It\'ll be about 2 hours long with practical exercises.',
        timestamp: new Date(Date.now() - 165600000)
      }
    ]
  };
  
  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowConversations(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize with sample data
  useEffect(() => {
    // In a real app, we would fetch conversations from Firestore
    const sampleConversations = sampleUsers.map(user => ({
      id: user.id,
      otherUser: user,
      lastMessage: {
        text: sampleMessages[user.id][sampleMessages[user.id].length - 1].text,
        timestamp: sampleMessages[user.id][sampleMessages[user.id].length - 1].timestamp
      },
      unreadCount: user.id === 'user1' ? 2 : 0
    }));
    
    setConversations(sampleConversations);
    
    // If we have a userId in the URL, set it as active chat
    if (userId) {
      const user = sampleUsers.find(u => u.id === userId);
      if (user) {
        setActiveChat({
          id: userId,
          otherUser: user
        });
        setMessages(sampleMessages[userId]);
        setShowConversations(false);
      }
    }
  }, [userId]);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const selectChat = (conversation) => {
    setActiveChat(conversation);
    setMessages(sampleMessages[conversation.id] || []);
    if (isMobile) {
      setShowConversations(false);
    }
    navigate(`/chat/${conversation.id}`);
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeChat) return;
    
    // In a real app, we would save this to Firestore
    const newMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser.uid,
      text: messageText,
      timestamp: new Date()
    };
    
    // Update messages
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Update conversation's last message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeChat.id) {
        return {
          ...conv,
          lastMessage: {
            text: messageText,
            timestamp: new Date()
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setMessageText('');
  };
  
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Conversations list */}
      {(showConversations || !isMobile) && (
        <motion.div 
          initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-surface border-r border-blue-900/30 ${isMobile ? 'w-full' : 'w-80'} h-full flex flex-col`}
        >
          <div className="p-4 border-b border-blue-900/30">
            <h1 className="text-xl font-bold text-text mb-4">Messages</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="input pl-8 pr-4 py-2 w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => selectChat(conversation)}
                  className={`p-3 border-b border-blue-900/20 cursor-pointer transition-colors hover:bg-blue-900/20 ${
                    activeChat?.id === conversation.id ? 'bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      {conversation.otherUser.photoURL ? (
                        <img
                          src={conversation.otherUser.photoURL}
                          alt={conversation.otherUser.name}
                          className="h-12 w-12 rounded-full object-cover border border-blue-900/30"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-accent font-semibold">
                          {conversation.otherUser.name.charAt(0)}
                        </div>
                      )}
                      {conversation.otherUser.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-surface"></span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-text truncate">{conversation.otherUser.name}</h3>
                        <span className="text-xs text-gray-400">
                          {format(new Date(conversation.lastMessage.timestamp), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-accent text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                <FaUser className="mx-auto h-10 w-10 mb-2 opacity-20" />
                <p>No conversations found</p>
                <p className="text-sm">Start a new chat from user profiles</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Chat area */}
      {activeChat ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col h-full bg-primary"
        >
          {/* Chat header */}
          <div className="p-3 border-b border-blue-900/30 flex items-center">
            {isMobile && (
              <button 
                onClick={() => setShowConversations(true)}
                className="mr-2 p-2 rounded-full hover:bg-blue-900/30 text-gray-300"
              >
                <FaChevronLeft />
              </button>
            )}
            
            <div className="flex items-center flex-1">
              {activeChat.otherUser.photoURL ? (
                <img
                  src={activeChat.otherUser.photoURL}
                  alt={activeChat.otherUser.name}
                  className="h-10 w-10 rounded-full object-cover border border-blue-900/30"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-accent font-semibold">
                  {activeChat.otherUser.name.charAt(0)}
                </div>
              )}
              
              <div className="ml-3">
                <h3 className="font-medium text-text">{activeChat.otherUser.name}</h3>
                <p className="text-xs text-gray-400">
                  {activeChat.otherUser.isOnline 
                    ? 'Online' 
                    : `Last active ${format(new Date(activeChat.otherUser.lastActive), 'h:mm a')}`
                  }
                </p>
              </div>
            </div>
            
            <button className="p-2 rounded-full hover:bg-blue-900/30 text-gray-300">
              <FaEllipsisH />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUser.uid;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && showAvatar && (
                        <img
                          src={activeChat.otherUser.photoURL}
                          alt={activeChat.otherUser.name}
                          className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                        />
                      )}
                      
                      <div className={`max-w-[75%] ${!isCurrentUser && !showAvatar ? 'ml-10' : ''}`}>
                        <div 
                          className={`p-3 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-accent text-primary rounded-tr-none' 
                              : 'bg-blue-900/30 text-text rounded-tl-none'
                          }`}
                        >
                          {message.text}
                        </div>
                        <div className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Message input */}
          <div className="border-t border-blue-900/30 p-3">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="input flex-1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!messageText.trim()}
                className="btn-primary"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-primary text-center p-4">
          <div>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-800 mx-auto mb-4 opacity-50">
              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 9C8 9 9 7 12 7C15 7 16 9 16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 14L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17 14L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.5 11C7.5 11 9 15 12 15C15 15 16.5 11 16.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h2 className="text-xl font-semibold text-text mb-2">Select a conversation</h2>
            <p className="text-gray-400 max-w-md">
              Choose an existing conversation from the sidebar or start a new one from a user's profile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;