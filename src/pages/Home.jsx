import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, limit, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaCommentAlt, FaHeart, FaShare, FaBookmark, FaShieldAlt } from 'react-icons/fa';

// Components
import Post from '../components/Post';
import CreatePostForm from '../components/CreatePostForm';

function Home() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  // Sample data for demonstration purposes
  const samplePosts = [
    {
      id: '1',
      author: {
        id: 'user1',
        name: 'CyberDefender',
        photoURL: 'https://i.pravatar.cc/150?img=1',
      },
      content: 'Just discovered a new phishing technique targeting social media users. Be cautious of messages asking for verification of your account through suspicious links. Always check the URL before entering credentials! #CyberSecurity #PhishingAlert',
      createdAt: new Date(Date.now() - 3600000),
      likes: 42,
      comments: 12,
      shares: 8,
      tags: ['cybersecurity', 'phishing', 'awareness']
    },
    {
      id: '2',
      author: {
        id: 'user2',
        name: 'PrivacyAdvocate',
        photoURL: 'https://i.pravatar.cc/150?img=2',
      },
      content: `If you're experiencing cyberbullying, remember these steps:
      
      1. Don't respond to the bully
      2. Save evidence (screenshots, messages)
      3. Block the person
      4. Report to the platform
      5. Tell someone you trust
      
      You're not alone in this fight. #StopCyberbullying`,
      createdAt: new Date(Date.now() - 86400000),
      likes: 128,
      comments: 37,
      shares: 54,
      tags: ['cyberbullying', 'support', 'awareness']
    },
    {
      id: '3',
      author: {
        id: 'user3',
        name: 'CodeNinja',
        photoURL: 'https://i.pravatar.cc/150?img=3',
      },
      content: `Here's a simple Python script to check if a password has been compromised:

\`\`\`python
import hashlib
import requests

def check_password(password):
    # Hash the password with SHA-1
    sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]
    
    # Query the API with just the prefix
    response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}")
    
    # Check if the suffix is in the response
    for line in response.text.splitlines():
        if line.split(':')[0] == suffix:
            return True
    return False

# Example usage
password = "password123"
if check_password(password):
    print("Password has been compromised!")
else:
    print("Password seems secure!")
\`\`\`

Stay safe online! #CodeForSecurity`,
      createdAt: new Date(Date.now() - 172800000),
      likes: 95,
      comments: 23,
      shares: 18,
      tags: ['coding', 'python', 'passwordsecurity']
    }
  ];

  const handleCreatePost = async (postData) => {
    try {
      // In a real app, this would add the post to Firebase
      console.log('Creating new post:', postData);
      // Add the new post to the beginning of the list
      setPosts([
        {
          id: Date.now().toString(),
          author: {
            id: currentUser.uid,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          content: postData.content,
          createdAt: new Date(),
          likes: 0,
          comments: 0,
          shares: 0,
          tags: postData.tags || [],
        },
        ...posts,
      ]);
      
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero section */}
      <div className="bg-surface rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-900/50 to-primary opacity-50" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Welcome to SSocieyt</h1>
          <p className="text-lg text-gray-300 mb-6">
            A safe space for sharing cybersecurity knowledge and supporting those affected by cyber bullying.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowCreatePost(true)}
              className="btn btn-primary"
            >
              Share Your Experience
            </button>
            <Link to="/support" className="btn bg-blue-800/50 text-text hover:bg-blue-800 border border-blue-700">
              Get Support
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="240" height="240" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 9C8 9 9 7 12 7C15 7 16 9 16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 14L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M17 14L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.5 11C7.5 11 9 15 12 15C15 15 16.5 11 16.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      
      {/* Create post */}
      {showCreatePost ? (
        <CreatePostForm onSubmit={handleCreatePost} onCancel={() => setShowCreatePost(false)} />
      ) : (
        <div className="bg-surface rounded-lg p-4 mb-6 border border-blue-900/20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="h-10 w-10 rounded-full object-cover border border-blue-800"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-accent font-semibold border border-blue-800">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowCreatePost(true)}
              className="input bg-secondary hover:bg-blue-900 text-left text-gray-400 flex-1 cursor-text transition duration-200"
            >
              Share your thoughts or experiences...
            </button>
          </div>
          <div className="flex mt-3 pt-3 border-t border-blue-900/20 justify-between">
            <button className="btn text-sm bg-transparent text-gray-300 hover:bg-blue-900/30">
              <FaShieldAlt className="h-4 w-4" />
              <span>Security Tip</span>
            </button>
            <button className="btn text-sm bg-transparent text-gray-300 hover:bg-blue-900/30">
              <FaCommentAlt className="h-4 w-4" />
              <span>Ask for Help</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent border-r-2 border-b-2 border-transparent"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          // Use sample posts for demonstration
          samplePosts.map(post => (
            <Post key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;