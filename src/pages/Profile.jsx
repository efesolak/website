import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUserShield, FaCalendarAlt, FaShieldAlt, FaUserFriends, FaEdit, FaEnvelope } from 'react-icons/fa';

// Components
import Post from '../components/Post';

function Profile() {
  const { userId } = useParams();
  const { currentUser, getUserProfile } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  
  const isCurrentUser = currentUser?.uid === userId;
  
  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        // In a real app, you would fetch this data from Firestore
        // For demonstration, we're using sample data
        
        // Sample user profile
        const userProfile = {
          uid: userId,
          username: 'CyberDefender',
          displayName: 'Alex Johnson',
          photoURL: 'https://i.pravatar.cc/300?img=12',
          bio: 'Cybersecurity enthusiast and anti-bullying advocate. Here to help others stay safe online.',
          joinDate: new Date(2023, 5, 15),
          followers: 128,
          following: 75,
          expertise: ['Network Security', 'Threat Analysis', 'Privacy']
        };
        
        setProfile(userProfile);
        
        // Sample posts
        const userPosts = [
          {
            id: 'p1',
            author: {
              id: userId,
              name: userProfile.displayName,
              photoURL: userProfile.photoURL,
            },
            content: 'Just published a new guide on securing your social media accounts against hackers. Check it out in the resources section! #SecurityTips #SocialMedia',
            createdAt: new Date(Date.now() - 172800000),
            likes: 42,
            comments: 8,
            shares: 12,
            tags: ['securitytips', 'socialmedia', 'privacy']
          },
          {
            id: 'p2',
            author: {
              id: userId,
              name: userProfile.displayName,
              photoURL: userProfile.photoURL,
            },
            content: `Here's a quick tip for parents: Enable parental controls on your children's devices and regularly check their online activity. Open communication is key to preventing cyberbullying. #ParentingTips #CyberSafety`,
            createdAt: new Date(Date.now() - 432000000),
            likes: 56,
            comments: 14,
            shares: 23,
            tags: ['parentingtips', 'cybersafety', 'cyberbullying']
          },
          {
            id: 'p3',
            author: {
              id: userId,
              name: userProfile.displayName,
              photoURL: userProfile.photoURL,
            },
            content: `Remember: A strong password is just the beginning. Always use 2FA (Two-Factor Authentication) when available for an extra layer of security. #2FA #PasswordSecurity`,
            createdAt: new Date(Date.now() - 604800000),
            likes: 38,
            comments: 5,
            shares: 10,
            tags: ['2fa', 'passwordsecurity', 'cybersecurity']
          }
        ];
        
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent border-r-2 border-b-2 border-transparent"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-text mb-4">User Not Found</h2>
        <p className="text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary mt-6 inline-flex">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Cover photo */}
      <div className="h-48 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* Profile info */}
      <div className="relative -mt-16 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Profile picture */}
          <div className="relative">
            <img 
              src={profile.photoURL} 
              alt={profile.displayName}
              className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-lg"
            />
            {isCurrentUser && (
              <button className="absolute bottom-0 right-0 bg-accent text-primary rounded-full p-2 shadow-md">
                <FaEdit />
              </button>
            )}
          </div>
          
          {/* User info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-text">{profile.displayName}</h1>
            <p className="text-accent">@{profile.username}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {isCurrentUser ? (
              <Link to="/settings" className="btn btn-secondary">
                <FaEdit className="mr-2" />
                Edit Profile
              </Link>
            ) : (
              <>
                <button className="btn btn-primary">
                  <FaUserFriends className="mr-2" />
                  Follow
                </button>
                <Link to={`/chat/${userId}`} className="btn btn-secondary">
                  <FaEnvelope className="mr-2" />
                  Message
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Bio and stats */}
        <div className="mt-6 mb-8">
          <div className="card">
            <p className="text-gray-300 mb-4">{profile.bio}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center text-sm text-gray-400">
                <FaUserShield className="mr-2 text-accent" />
                <span>Cybersecurity Expert</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FaCalendarAlt className="mr-2 text-accent" />
                <span>Joined {profile.joinDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FaUserFriends className="mr-2 text-accent" />
                <span>{profile.followers} followers</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FaShieldAlt className="mr-2 text-accent" />
                <span>{profile.following} following</span>
              </div>
            </div>
            
            {profile.expertise && profile.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.expertise.map(skill => (
                  <span key={skill} className="bg-blue-900/30 text-accent text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-blue-900/30 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shorts'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              Shorts
            </button>
          </nav>
        </div>
        
        {/* Content based on active tab */}
        <div>
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map(post => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <div className="card text-center py-10">
                  <p className="text-gray-400">No posts yet</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'articles' && (
            <div className="card text-center py-10">
              <p className="text-gray-400">No articles published yet</p>
            </div>
          )}
          
          {activeTab === 'shorts' && (
            <div className="card text-center py-10">
              <p className="text-gray-400">No shorts uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;