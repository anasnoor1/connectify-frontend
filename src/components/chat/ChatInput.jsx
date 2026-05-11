import { useState, useRef, useEffect } from "react";
import EmojiPicker from "./EmojiPicker";
import { PaperclipIcon, Send, Smile, X } from "lucide-react";

export default function ChatInput({ onSend, isReadOnly, roomId, onTypingStart, onTypingStop }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  // Handle typing indicators
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!isReadOnly && newText.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        onTypingStart?.(roomId);
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTypingStop?.(roomId);
      }, 1000);
    } else {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop?.(roomId);
      }
    }
  };

  const send = () => {
    if (isReadOnly) return;
    if (!text.trim() && selectedFiles.length === 0) return;

    const messageData = {
      text: text.trim(),
      attachments: selectedFiles
    };

    onSend(messageData);
    setText("");
    setSelectedFiles([]);
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onTypingStop?.(roomId);
    }
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-white/90 backdrop-blur-sm">
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                <PaperclipIcon className="w-4 h-4 text-gray-500" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <span className="text-gray-500 text-xs">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto flex items-end gap-2 px-3 py-2">
        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isReadOnly}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>

        {/* Textarea with Emoji Picker */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed pr-10"
            placeholder={isReadOnly ? "Campaign is completed. Chat is read-only." : "Type a message..."}
            disabled={isReadOnly}
            rows={1}
          />
          
          {/* Emoji Picker Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isReadOnly}
            className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Emoji Picker Dropdown */}
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={send}
          disabled={isReadOnly || (!text.trim() && selectedFiles.length === 0)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isReadOnly || (!text.trim() && selectedFiles.length === 0)
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md"
          }`}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-3 py-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>typing...</span>
          </div>
        </div>
      )}
    </div>
  );
}