import { useState } from 'react';
import { FaTimes, FaCode, FaImage, FaLink, FaTag } from 'react-icons/fa';
import { motion } from 'framer-motion';

function CreatePostForm({ onSubmit, onCancel }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({
        content,
        tags
      });
    }
  };
  
  const addCodeBlock = () => {
    const codeTemplate = '\n```language\n// Your code here\n```\n';
    setContent(prev => prev + codeTemplate);
    // Focus and place cursor in the right spot
    setTimeout(() => {
      const textarea = document.getElementById('post-content');
      const position = content.length + 11; // Position after "```language\n"
      textarea.focus();
      textarea.setSelectionRange(position, position);
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg p-4 mb-6 border border-blue-900/30 shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text">Create Post</h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-blue-900/30"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          id="post-content"
          placeholder="Share your cybersecurity knowledge or experience..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input w-full h-32 resize-none mb-4"
          required
        />
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <div key={tag} className="bg-secondary text-gray-300 px-2 py-1 rounded-full text-sm flex items-center">
              #{tag}
              <button 
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-400 hover:text-gray-300"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
          
          <form onSubmit={handleAddTag} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="input py-1 pl-6 pr-2 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaTag className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            <button 
              type="submit"
              className="ml-1 btn-secondary py-1 px-2 text-sm"
            >
              Add
            </button>
          </form>
        </div>
        
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-2 mb-3 sm:mb-0">
            <button 
              type="button"
              onClick={addCodeBlock}
              className="bg-blue-900/30 text-gray-300 hover:bg-blue-900/50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
            >
              <FaCode />
              <span>Code</span>
            </button>
            <button 
              type="button"
              className="bg-blue-900/30 text-gray-300 hover:bg-blue-900/50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
            >
              <FaImage />
              <span>Image</span>
            </button>
            <button 
              type="button"
              className="bg-blue-900/30 text-gray-300 hover:bg-blue-900/50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
            >
              <FaLink />
              <span>Link</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={onCancel}
              className="btn-secondary py-2 px-4"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!content.trim()}
              className="btn-primary py-2 px-4 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default CreatePostForm;