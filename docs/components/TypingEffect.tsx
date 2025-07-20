
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypingEffectProps {
  fullText: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ fullText }) => {
  const [text, setText] = useState('');
  
  useEffect(() => {
    setText(''); // Reset when fullText changes
    if (!fullText) return;
    
    // Split by spaces and newlines to type "words" for a better markdown rendering experience
    const words = fullText.split(/(\s+)/);
    let i = 0;
    
    const timer = setInterval(() => {
        if (i < words.length) {
            setText(prev => prev + words[i]);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 30); // 30ms interval per word/space chunk feels like a good speed

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
  );
};

export default TypingEffect;
