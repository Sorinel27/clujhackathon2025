
import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search products..." }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState([
    'Cordless drill',
    'BOSCH drill',
    'Power tools',
    'Circular saw',
    'Impact driver',
    'DEWALT tools',
    'Professional drill',
    'Battery tools'
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && 
    suggestion.toLowerCase() !== value.toLowerCase()
  ).slice(0, 5);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    if (value.length > 0) {
      setShowSuggestions(true);
    }
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (value.length > 0 || showSuggestions) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {value.length === 0 ? (
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <Clock className="w-4 h-4" />
                <span>Recent searches</span>
              </div>
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div className="p-2">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          ) : value.length > 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No suggestions found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
