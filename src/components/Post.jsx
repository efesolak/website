import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark, FaEllipsisH } from 'react-icons/fa';

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const toggleLike = () => {
    setLiked(!liked);
  };
  
  const toggleSave = () => {
    setSaved(!saved);
  };
  
  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      console.log('New comment:', commentText);
      setCommentText('');
      // In a real app, you would add the comment to Firebase here
    }
  };
  
  const formatContent = (content) => {
    // Split content by code blocks
    const parts = content.split('```');
    
    if (parts.length === 1) {
      // No code blocks, format regular content
      return formatRegularContent(content);
    }
    
    return parts.map((part, index) => {
      // Even indexes are regular text, odd indexes are code blocks
      if (index % 2 === 0) {
        return formatRegularContent(part);
      } else {
        // This is a code block
        const lines = part.split('\n');
        let language = '';
        let code = part;
        
        // Check if the first line specifies a language
        if (lines.length > 1 && !lines[0].match(/[\s{}()[\]"']/)) {
          language = lines[0];
          code = lines.slice(1).join('\n');
        }
        
        return (
          <div key={index} className="my-3 overflow-hidden rounded-md">
            {language && (
              <div className="bg-blue-900/50 px-4 py-1 text-xs font-mono text-gray-300 border-b border-blue-800">
                {language}
              </div>
            )}
            <pre className="bg-gray-900 p-4 overflow-x-auto text-gray-300 font-mono text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
    });
  };
  
  const formatRegularContent = (text) => {
    // Split by newlines and add proper spacing
    return text.split('\n').map((line, i) => {
      // Check if it's a numbered or bulleted list item
      const isListItem = line.match(/^(\d+\.|\*|\-)\s/);
      
      if (isListItem) {
        return <li key={i} className="ml-5">{line.replace(/^(\d+\.|\*|\-)\s/, '')}</li>;
      }
      
      // Return regular paragraph if not empty
      return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface rounded-lg border border-blue-900/20 shadow-md overflow-hidden"
    >
      {/* Post header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.id}`} className="flex-shrink-0">
            {post.author.photoURL ? (
              <img 
                src={post.author.photoURL} 
                alt={post.author.name} 
                className="h-10 w-10 rounded-full object-cover border border-blue-800"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-accent font-semibold border border-blue-800">
                {post.author.name.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/profile/${post.author.id}`} className="font-medium text-text hover:text-accent">
              {post.author.name}
            </Link>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-blue-900/30 text-gray-400 hover:text-gray-300"
          >
            <FaEllipsisH />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-blue-900/30 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-900/30">
                    Report post
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-900/30">
                    Hide post
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-blue-900/30">
                    Block user
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Post content */}
      <div className="px-4 pb-2">
        <div className="text-gray-200 whitespace-pre-line">
          {formatContent(post.content)}
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/tag/${tag}`}
                className="text-xs bg-blue-900/30 text-accent px-2 py-1 rounded-full hover:bg-blue-900/50"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Post stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-400 border-t border-blue-900/20">
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-1 ${liked ? 'text-danger' : 'hover:text-gray-300'}`} onClick={toggleLike}>
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300" onClick={() => setShowComments(!showComments)}>
            <FaComment />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300">
            <FaShare />
            <span>{post.shares}</span>
          </button>
        </div>
        
        <button className={`${saved ? 'text-accent' : 'hover:text-gray-300'}`} onClick={toggleSave}>
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-blue-900/20">
          <form onSubmit={handleComment} className="flex items-center gap-2 mb-3">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="input flex-1 py-1 text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="btn-primary py-1 px-3 text-sm disabled:opacity-50"
            >
              Post
            </button>
          </form>
          
          {/* Example comments - in a real app, these would come from Firebase */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <img src="https://i.pravatar.cc/150?img=4" alt="User" className="h-8 w-8 rounded-full object-cover" />
              <div className="flex-1">
                <div className="bg-primary rounded-lg p-2">
                  <p className="text-sm font-medium text-gray-300">SecurityExpert</p>
                  <p className="text-sm text-gray-300">Great insights! I'd also recommend using HTTPS Everywhere as a browser extension.</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>2h ago</span>
                  <button className="hover:text-gray-300">Like</button>
                  <button className="hover:text-gray-300">Reply</button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <img src="https://i.pravatar.cc/150?img=5" alt="User" className="h-8 w-8 rounded-full object-cover" />
              <div className="flex-1">
                <div className="bg-primary rounded-lg p-2">
                  <p className="text-sm font-medium text-gray-300">CodeEnthusiast</p>
                  <p className="text-sm text-gray-300">Thanks for sharing. I've been dealing with similar issues lately.</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>1h ago</span>
                  <button className="hover:text-gray-300">Like</button>
                  <button className="hover:text-gray-300">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Post;