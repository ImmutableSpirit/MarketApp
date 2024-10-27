// Watchlist.jsx
import React, { useState, useEffect } from 'react';
import './Watchlist.css';

const Watchlist = ({ selectedTicker, onSelectTicker, onAddTicker, onRemoveTicker, initialTickers  }) => {
  const [ticker, setTicker] = useState('');
  const [watchlist, setWatchlist] = useState(initialTickers); 

  useEffect(() => {
    setWatchlist(initialTickers);
  }, [initialTickers]);

  const handleAddTicker = async () => {
    if (ticker && !watchlist.includes(ticker.toUpperCase())) {
      const success = await onAddTicker(ticker.toUpperCase());
      if (success) {
        setWatchlist([...watchlist, ticker.toUpperCase()]);
        setTicker('');
      } else {        
        console.error('Failed to add ticker');
      }
    }
  };

  const handleRemoveTicker = async (tickerToRemove) => {
    const success = await onRemoveTicker(tickerToRemove.toUpperCase());
      if (success) {
        setWatchlist(watchlist.filter(t => t !== tickerToRemove));      
        if (selectedTicker === tickerToRemove) {
          onSelectTicker(null);
        }
      } else {        
        console.error('Failed to add ticker');
      }
  };

  return (
    <div className="watchlist">
      <div className="watchlist-input">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker"
        />
        <button className="add-button" onClick={handleAddTicker}>+</button>
      </div>
      <div className="watchlist-container">
        <ul className="watchlist-items">
            {watchlist.map((item) => (
            <li key={item}>
                <span 
                className={`ticker-span ${selectedTicker === item ? 'selected' : ''}`}
                onClick={() => onSelectTicker(item)}
                >
                {item}
                </span>
                <button className="remove-button" onClick={() => handleRemoveTicker(item)}>-</button>
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;